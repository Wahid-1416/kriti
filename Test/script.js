const stars = document.querySelectorAll('.star');
const userRating = document.querySelector('.user-rating');

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
      star.src = './star.svg';
    } else {
      star.src = './unstar.svg';
    }
  });
}

function displayUserRating(rating) {
  userRating.textContent = `You rated this ${rating} stars.`;
}
