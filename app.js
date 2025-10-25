const form=document.getElementById('timer-form')
const hoursInput=document.getElementById('hours')
const minutesInput=document.getElementById('minutes')
const secondsInput=document.getElementById('seconds')
const timersList=document.getElementById('timers-list')
const emptyState=document.getElementById('empty-state')
const alarmAudio=document.getElementById('alarm-audio')
let timersMap={}
let counter=0
function pad(n){return String(n).padStart(2,'0')}
function formatTime(sec){
  const h=Math.floor(sec/3600)
  const m=Math.floor((sec%3600)/60)
  const s=sec%60
  return `${pad(h)} : ${pad(m)} : ${pad(s)}`
}
function updateEmptyState(){
  if(Object.keys(timersMap).length===0){
    emptyState.style.display='block'
  }else{
    emptyState.style.display='none'
  }
}
function createTimerElement(id,remaining){
  const li=document.createElement('li')
  li.className='timer-item'
  li.dataset.id=id
  const left=document.createElement('div')
  left.className='timer-left'
  const label=document.createElement('div')
  label.className='timer-label'
  label.textContent='Time Left :'
  const timeVal=document.createElement('div')
  timeVal.className='time-val'
  timeVal.textContent=formatTime(remaining)
  left.appendChild(label)
  left.appendChild(timeVal)
  const actions=document.createElement('div')
  actions.className='timer-actions'
  const del=document.createElement('button')
  del.className='del-btn'
  del.type='button'
  del.textContent='Delete'
  del.addEventListener('click',()=>removeTimer(id))
  actions.appendChild(del)
  li.appendChild(left)
  li.appendChild(actions)
  return li
}
function removeTimer(id){
  const t=timersMap[id]
  if(!t) return
  clearInterval(t.interval)
  if(t.playing){
    alarmAudio.pause()
    alarmAudio.currentTime=0
  }
  const el=timersList.querySelector(`[data-id="${id}"]`)
  if(el) el.remove()
  delete timersMap[id]
  updateEmptyState()
}
function markEnded(id){
  const t=timersMap[id]
  if(!t) return
  t.ended=true
  alarmAudio.loop=true
  alarmAudio.play().catch(()=>{})
  t.playing=true
  const el=t.element
  el.innerHTML=''
  const panel=document.createElement('div')
  panel.className='up-panel'
  panel.textContent='Timer Is Up !'
  const stop=document.createElement('button')
  stop.className='stop-btn'
  stop.type='button'
  stop.textContent='Stop'
  stop.addEventListener('click',()=>{
    if(t.playing){
      alarmAudio.pause()
      alarmAudio.currentTime=0
      t.playing=false
    }
    removeTimer(id)
  })
  panel.appendChild(stop)
  el.appendChild(panel)
}
form.addEventListener('submit',function(e){
  e.preventDefault()
  const h=parseInt(hoursInput.value||'0',10)
  const m=parseInt(minutesInput.value||'0',10)
  const s=parseInt(secondsInput.value||'0',10)
  if(Number.isNaN(h)||Number.isNaN(m)||Number.isNaN(s)) return
  if(h<0||m<0||s<0) return
  if(m>59||s>59) return
  const total=h*3600 + m*60 + s
  if(total<=0) return
  const id=++counter
  const li=createTimerElement(id,total)
  timersList.appendChild(li)
  updateEmptyState()
  const timerObj={id,remaining:total,interval:null,ended:false,playing:false,element:li}
  timersMap[id]=timerObj
  timerObj.interval=setInterval(()=>{
    timerObj.remaining--
    const tv=timerObj.element.querySelector('.time-val')
    if(tv) tv.textContent=formatTime(Math.max(0,timerObj.remaining))
    if(timerObj.remaining<=0){
      clearInterval(timerObj.interval)
      markEnded(id)
    }
  },1000)
  hoursInput.value=''
  minutesInput.value=''
  secondsInput.value=''
})
updateEmptyState()
