// getting elements

let filters=document.querySelector('.filters')
const start=document.querySelector('.start')
let quiz=document.querySelector('.quiz')
const loader=document.querySelector('.loader')
 

 let count=1
 let data

 start.addEventListener('click',()=>{
    // assigning values
 let numberOfCorrectAnswers=0
 let numberOfIncorrectAnswers=0
    let quesNumber=0
    // getting elements after starting
    let categoriesOptions=document.querySelector('.categories-options')
let category=categoriesOptions.value

let levelsOptions=document.querySelector('.levels-options')
let level=levelsOptions.value

let limit=document.querySelector('.limit').value

    filters.style.display="none"
    loader.style.display="block"

    var styles = {
        "display": "flex",
       "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center"
    };
    Object.assign(quiz.style, styles);
    if(limit===''){
        limit=10
    }

    limit=parseInt(limit)
   // console.log(category,limit,level);
    getQuestions(category,limit,level,quesNumber,numberOfCorrectAnswers,numberOfIncorrectAnswers)
    
 })
 function getQuestions(category,limit,level,quesNumber,numberOfCorrectAnswers,numberOfIncorrectAnswers){

    gettingData(category,limit,level).then((data)=>{
      //  console.log('resolved successfully',data);
showQuestions(data,quesNumber,count,limit,numberOfCorrectAnswers,numberOfIncorrectAnswers)
       }).catch((err)=>{
        console.log('rejected probably wrong JSON',err);
       })
 }
let quizData

const gettingData=async (category,limit,level)=>{
    
   quizData= await  fetch(`https://the-trivia-api.com/api/questions?limit=${limit}&categories=${category}&difficulty=${level}`, {
    headers: {
      // An API key is not required for this endpoint,
      // but can be used to bypass the rate limit or request
      // more questions.
      
      'Content-Type': 'application/json'
    }
  })
  if(quizData.status!==200){
    throw new Error('sorry could not fetch data')
     
   }
         // for getting the actual data
         const data= await quizData.json()
         return data
}
 

// displaying questions
function showQuestions(data,quesNumber,count,limit,numberOfCorrectAnswers,numberOfIncorrectAnswers){
    if(quesNumber>limit-1){
       // console.log("khatam");
         ending(numberOfCorrectAnswers,numberOfIncorrectAnswers)
        return
       
    }
    else{

    let random=Math.floor(Math.random()*3)
    
  //  console.log('thikai xa ta',data);
    const question=data[quesNumber].question
    let correctAnswer=data[quesNumber].correctAnswer
   // console.log(correctAnswer);
  
    const incorrectAnswers=data[quesNumber].incorrectAnswers
    incorrectAnswers.splice(random,0,correctAnswer)
    
  //  console.log(incorrectAnswers);
// console.log(question);

    const displayingQuestions=document.createElement('div')
    displayingQuestions.classList.add('question-answer')
    displayingQuestions.innerHTML=`<h1 class="actual-question">${count}. ${question}</h1>
    <div class="options-list">
    <h3 class="options">${incorrectAnswers[0]}</h3>
    <h3 class="options">${incorrectAnswers[1]}</h3>
    <h3 class="options">${incorrectAnswers[2]}</h3>
    <h3 class="options">${incorrectAnswers[3]}</h3>
    </div>
    <div class="buttons">
    <button class="skip">Skip</button>
    <button class="next">Next</button>
    </div>`
    quiz.append(displayingQuestions)
    loader.style.display="none"
    let elementsAgain=document.querySelectorAll('.options')
   // console.log("k vako",elementsAgain);
    
elementsAgain.forEach((element)=>{
    if(element.innerText===correctAnswer){
        element.classList.add('correct')
    }
}) 
    
   
   
    const answeredOptions=Array.from(document.querySelectorAll('.options'))
    const nextBtn=document.querySelector('.next')
    const skipBtn=document.querySelector('.skip')
   
   
    answeredOptions.forEach(element=>{
        element.addEventListener('click',()=>{
          const index =answeredOptions.indexOf(element)
         // console.log(index);
          checkingMiddle(answeredOptions,index)
             
            })
           
           
        
        
    })
    nextBtn.addEventListener('click',()=>{
        nextQuestions(data,quesNumber,displayingQuestions,limit,numberOfCorrectAnswers,numberOfIncorrectAnswers,correctAnswer)
    })
    skipBtn.addEventListener('click',()=>{
        quesNumber++
        count++
        quiz.removeChild(displayingQuestions)
        showQuestions(data,quesNumber,count,limit,numberOfCorrectAnswers,numberOfIncorrectAnswers) 
    })
 }
}


function nextQuestions(data,quesNumber,displayingQuestions,limit,numberOfCorrectAnswers,numberOfIncorrectAnswers){
  
let elements2=document.querySelectorAll('.options')
elements2.forEach((element)=>{
    if(element.classList.contains('clicked')){
        if(element.classList.contains('correct')){
            numberOfCorrectAnswers++
            quesNumber++
                count++
                quiz.removeChild(displayingQuestions)
                showQuestions(data,quesNumber,count,limit,numberOfCorrectAnswers,numberOfIncorrectAnswers)
        }
        else{
            numberOfIncorrectAnswers++
            quesNumber++
                count++
                quiz.removeChild(displayingQuestions)
                showQuestions(data,quesNumber,count,limit,numberOfCorrectAnswers,numberOfIncorrectAnswers)
        }
    }
    
})
        
  
   // console.log("khoi ta next",numberOfCorrectAnswers,numberOfIncorrectAnswers);
  /*
                quesNumber++
                count++
                quiz.removeChild(displayingQuestions)
                showQuestions(data,quesNumber,count,limit)
          */

       
    }
    

    
    function checkingMiddle(answeredOptions,index){
    answeredOptions.forEach((element)=>{
if(answeredOptions.indexOf(element)===index ){
element.classList.add('clicked')

}
else{
    element.classList.remove('clicked')
  
}
    })
  
}
function ending(numberOfCorrectAnswers,numberOfIncorrectAnswers){
    let totalQuestions=numberOfCorrectAnswers+numberOfIncorrectAnswers
   // console.log("finally",numberOfCorrectAnswers,numberOfIncorrectAnswers);
    const endMessage=document.createElement('div')
    endMessage.classList.add('ending')
    endMessage.innerHTML=`<h1 class="end-heading">Congratulations!! You completed the quiz</h1>
    <h3 class="questions-head" >Total Questions Attempted: ${totalQuestions}</h3>
    <h3 class="result-head" >You got ${numberOfCorrectAnswers} right.</h3>
    <h3 class="result-head">You got ${numberOfIncorrectAnswers} wrong.</h3> 
    <button class="restart">Restart</button>`
    quiz.append(endMessage)
    const restart=document.querySelector('.restart')
    restart.addEventListener('click',()=>{
        endMessage.remove()
        
        filters.style.display="flex"
        count=1
    })
}