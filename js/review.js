$(function () {
  let sortMode = 0;
  let reviews = [];
  let currentCategory = null;

  const allCategories = ["문구류", "잡화/생활용품", "디지털악세서리"];

  function renderStars(rating) {
    const full = '<img src="images/Star1.png" alt="별점">'.repeat(rating);
    const empty = '<img src="images/Star2.png" alt="빈 별점">'.repeat(5 - rating);
    return full + empty;
  }

function renderReviews(data) {
  $('.contents').empty();
  data.forEach((item) => {
    const indexInOriginal = reviews.indexOf(item); // ← 원본 배열에서의 인덱스
    const shortReview = item.review.length > 100 ? item.review.slice(0, 100) + '…' : item.review;

    const html = `
      <div class="review_con" data-index="${indexInOriginal}">
        <a href="#">
          <div class="r_img"><img src="images/${item.url}" alt="${item.title}"></div>
          <div class="rating">${renderStars(item.rating)}</div>
          <h3>${item.title}</h3>
          <p>${shortReview}</p>
        </a>
      </div>
    `;
    $('.contents').append(html);
  });
}

  function sortReviews(data) {
    let sorted = [...data];
    switch (sortMode) {
      case 0:
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        $('p.latest').text('▽ 최신순');
        break;
      case 1:
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        $('p.latest').text('▽ 오래된순');
        break;
      case 2:
        sorted.sort((a, b) => b.rating === a.rating
          ? new Date(b.date) - new Date(a.date)
          : b.rating - a.rating);
        $('p.latest').text('▽ 별점 높은순');
        break;
      case 3:
        sorted.sort((a, b) => a.rating === b.rating
          ? new Date(b.date) - new Date(a.date)
          : a.rating - b.rating);
        $('p.latest').text('▽ 별점 낮은순');
        break;
    }
    renderReviews(sorted);
  }

  function updateCategoryMenu(selected) {
    const remaining = allCategories.filter(cat => cat !== selected);
    const listHTML = remaining.map(cat => `<li><a href="#">${cat}</a></li>`).join('');
    $('ul.category').html(listHTML);
  }

  $('ul > li > a:contains("전체보기")').on('click', function (e) {
    e.preventDefault();
    currentCategory = null;
    sortReviews(reviews);
    $('ul.category').html(allCategories.map(cat => `<li><a href="#">${cat}</a></li>`).join(''));
    $('li:has(ul.category) > a').text('카테고리별');
  });

  $('ul.category').on('click', 'li a', function (e) {
    e.preventDefault();
    const selected = $(this).text();
    currentCategory = selected;

    const filtered = reviews.filter(item => item.category === selected);
    sortReviews(filtered);
    $('li:has(ul.category) > a').text(selected);
    updateCategoryMenu(selected);
  });

  $('p.latest').on('click', function () {
    sortMode = (sortMode + 1) % 4;
    const dataToSort = currentCategory
      ? reviews.filter(r => r.category === currentCategory)
      : reviews;
    sortReviews(dataToSort);
  });

// 모달 열기
$('body').on('click', '.review_con', function (e) {
  e.preventDefault();
  const index = $(this).data('index');
  const item = reviews[index];

  $('.modal img').attr('src', 'images/' + item.url).attr('alt', item.title);
  $('.modal figcaption').text(item.title);
  $('.modal .date').text(item.date);
  $('.modal .user').text(item.user);
  $('.modal .rating').html(renderStars(item.rating));
  $('.modal .review_text').text(item.review);

  $('.modal, .modal_bg').fadeIn(); // 둘 다 보이게
});

// 모달 닫기 (x 버튼)
$('body').on('click', '.close_modal', function (e) {
  e.preventDefault();
  $('.modal, .modal_bg').fadeOut(); // 둘 다 닫기
});

// 모달 배경 클릭하면 닫힘
$('body').on('click', '.modal_bg', function () {
  $('.modal, .modal_bg').fadeOut();
});

  $.ajax({
    url: "./json/review.json",
    dataType: "json",
    success: function (data) {
      reviews = data;
      sortReviews(reviews);
    }
  });
});
