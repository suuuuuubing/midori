$(function () {
  $.ajax({
    url: "./json/review.json",
    dataType: "json",
    success: function (data) {
      console.log(data);

      if (data.length > 0) {
        // 최신순 정렬 (날짜는 YYYY-MM-DD 형식이라고 가정)
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 상위 2개만 추출
        const recentReviews = sorted.slice(0, 2);

        for (let i = 0; i < recentReviews.length; i++) {
          $('.con_wrap').append(
            `
            <div class="review_con">
              <a href="review.html">
                <img src="images/N.png" alt="new" class="new">
                <div class="r_img"><img src="images/${recentReviews[i].url}" alt="${recentReviews[i].title}"></div>
                <div class="rating">${renderStars(recentReviews[i].rating)}</div>
                <h3>${recentReviews[i].title}</h3>
                <p>${recentReviews[i].review}</p>
              </a>
            </div>
            `
          );
        }
      }
    }
  });

  // 별점 렌더링
  function renderStars(rating) {
    const full = '<img src="images/Star1.png" alt="별점">'.repeat(rating);
    const empty = '<img src="images/Star2.png" alt="빈 별점">'.repeat(5 - rating);
    return full + empty;
  }

    // 메뉴 아이콘 클릭 (햄버거 ↔ X 전환 포함)
    $('.menu_icon').click(function(){
      const $menu = $('#menu_wrap');
      const isOpen = $menu.hasClass('active');
  
      if (isOpen) {
        // 메뉴 닫기
        $menu.removeClass('active');
        $('body').removeClass('menu_open');
        $(this).find('i').removeClass('fa-xmark').addClass('fa-bars'); // X → 햄버거
  
        // 메뉴 닫을 때 모든 서브메뉴 접기 + 아이콘 초기화
        $('#gnb .submenu').slideUp(0);
        $('.menuOnoff').removeClass('rotated');
      } else {
        // 메뉴 열기
        $menu.addClass('active');
        $('body').addClass('menu_open');
        $(this).find('i').removeClass('fa-bars').addClass('fa-xmark'); // 햄버거 → X
      }
    });
  
    // 메뉴 항목 클릭 시 하나만 열리게 하기
    $('#gnb ul li a').click(function(e){
      e.preventDefault();
  
      const $submenu = $(this).next('.submenu');
      const isVisible = $submenu.is(':visible');
  
      // 모든 서브메뉴 닫고 모든 화살표 초기화
      $('#gnb .submenu').slideUp(200);
      $('.menuOnoff').removeClass('rotated');
  
      if (!isVisible) {
        // 현재만 열기
        $submenu.slideDown(200);
        $(this).find('.menuOnoff').addClass('rotated');
      }
    });
});