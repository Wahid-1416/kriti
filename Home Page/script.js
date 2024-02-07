function swipper(){

    var swiper = new Swiper('.swiper', {
        slidesPerView: 2,
        direction: getDirection(),
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        on: {
          resize: function () {
            swiper.changeDirection(getDirection());
          },
        },
      });
    
      function getDirection() {
        var windowWidth = window.innerWidth;
        var direction = window.innerWidth <= 760 ? 'vertical' : 'horizontal';
    
        return direction;
      }
      var swiper1 = new Swiper('.swiper1', {
        slidesPerView: 3,
      })
}

function star(){

  const stars = document.querySelectorAll('.star-s');
  
  let selectedRating = 0;
  
  stars.forEach((star) => {
    star.addEventListener('mouseover', () => {
      const rating = parseInt(star.getAttribute('data-rating'));
      highlightStars(rating);
    });
  
    star.addEventListener('mouseout', () => {
      highlightStars(selectedRating);
    });
  
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-rating'));
      displayUserRating(selectedRating);
    });
  });
  
  function highlightStars(rating) {
    stars.forEach((star) => {
      const starRating = parseInt(star.getAttribute('data-rating'));
      if (starRating <= rating) {
        star.src = './Images/star.svg';
      } else {
        star.src = './Images/unstared.svg';
      }
    });
  }

}  

function feedback(){

  const feedB=document.querySelector("#nox")
  const but=document.querySelector("#FeedBackDownButton")
  const feedbackText=document.querySelector("#text")
  const sub=document.querySelector("#submiting")
  let flag=0;
  
  feedB.addEventListener("click",() =>{
      if(flag==0){
        feedbackText.style.display="flex";
        sub.style.display="flex";
        but.style.transform="rotate(90deg)";
        flag=1
      }
      else{
        feedbackText.style.display="none";
        sub.style.display="none";
        but.style.transform="rotate(0deg)";
        flag=0
      }
  }
  )
}

function popup_card(){

  var pro=document.querySelectorAll(".swiper-slide1")
  var popu=document.querySelectorAll("#details-main:not(.details)")
  var cross=document.querySelector("#cross")
  console.log(popu);
  
  
  pro.forEach(p => {
    p.addEventListener("click",()=>{
          gsap.to("#details-main",{
            scale: 1,
            duration: 0.5,
            opacity: 1
          })
    })
  });
  cross.addEventListener("click",()=>{
    gsap.to("#details-main",{
      scale: 0,
      duration: 0.5,
      opacity: 0
    })

  })

}  




star()
swipper()
feedback()
popup_card()



