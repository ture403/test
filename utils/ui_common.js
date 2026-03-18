//모달 열기
export const openModal = (event, type) => {
  const btn = event.currentTarget;
  const modalId = btn.getAttribute("modal-id");
  const target = document.getElementById(modalId);

  if (target) {
    setModal(modalId); // ID =`${modal-id}` 에 해당되는 모달 열기
  }
};

export const closeModal = (param) => {
  let target = null;
  
  // 1. 문자열 ID로 호출한 경우
  if (typeof param === 'string') {
    target = document.getElementById(param);
  }

  //2. 이벤트 객체로 호출한 경우
  if (!target && param?.currentTarget) {
    const modalId = param.currentTarget.getAttribute('modal-id');
    if (modalId) {
      target = document.getElementById(modalId);
    }
  }

  if (!target) return;
  target.style.display = "none";
  target.classList.remove('is-active');
  document.body.classList.remove('modal-open');
}

window.openModal = openModal;
window.closeModal = closeModal;

export const setModal = (target) => {
  // target : 모달 아이디
  target = document.getElementById(target);
  target.style.display = "flex";
  if (target.classList.contains("type-bottom")) {
    const modalHeadHeight = target.querySelector(".modal-header")
      ? target.querySelector(".modal-header").offsetHeight
      : 0;
    const modalFootHeight = target.querySelector(".modal-footer")
      ? target.querySelector(".modal-footer").offsetHeight
      : 0;

    let modalHeight = modalHeadHeight + modalFootHeight + 50;

    target.querySelector(
      ".modal-cont"
    ).style = `--modal-cont-height:${modalHeight}px`;
  }

  setTimeout(() => {
    target.classList.add("is-active");
    document.body.classList.add("modal-open");
  }, 300);
};


export const initViewportHeight = () => {
    let ticking = false;
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    const update = () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            setViewportHeight();
            ticking = false;
        });
    };
    update();
    window.addEventListener('resize', update, { passive: true });  
    return () => {
        window.removeEventListener('resize', update);
    };
};

export const headerFix = ({headerSelector ='header', offset = 50 } = {}) => {
    const headerEl = document.querySelector(headerSelector);
    if (!headerEl) return;
    let lastScrollY = window.scrollY;
    let isFixed = false;
    const onScroll = () => {
        const currentY = window.scrollY;
        if (currentY > offset && currentY > lastScrollY && !isFixed) {
            headerEl.classList.add('is-fixed');
            isFixed = true;
        }
        if (currentY <= offset && isFixed) {
            headerEl.classList.remove('is-fixed');
            isFixed = false;
        }
        lastScrollY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true }); 
    return () => {
        window.removeEventListener('scroll', onScroll);
        headerEl.classList.remove('is-fixed');
    };
};

export const fixTabOnScroll = ({headerSelector = 'header',tabSelector = '.tab-wrap'} = {}) => {
    const header = document.querySelector(headerSelector);
    const tabWrap = document.querySelector(tabSelector);
    if (!header || !tabWrap) return;
    const headerHeight = header.offsetHeight;
    const tabOffsetTop = tabWrap.getBoundingClientRect().top + window.scrollY;
    // 레이아웃 유지용 placeholder
    const placeholder = document.createElement('div');
    placeholder.style.height = `${tabWrap.offsetHeight}px`;
    placeholder.style.display = 'none';
    tabWrap.parentNode.insertBefore(placeholder, tabWrap);
    const onScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY + headerHeight >= tabOffsetTop) {
            if (!tabWrap.classList.contains('is-fixed')) {
                tabWrap.classList.add('is-fixed');
                // tabWrap.style.top = `${headerHeight}px`; ios 노치문제로 css에서 height 조정하기 위해 주석처리
                placeholder.style.display = 'block';
            }
        } else {
            if (tabWrap.classList.contains('is-fixed')) {
                tabWrap.classList.remove('is-fixed');
                tabWrap.style.top = '';
                placeholder.style.display = 'none';
            }
        }
    };
    window.addEventListener('scroll', onScroll);   
    return () => {
        window.removeEventListener('scroll', onScroll);
        placeholder.remove();
        tabWrap.classList.remove('is-fixed');
        tabWrap.style.top = '';
    };
}

export const quickToggle = ({
  buttonSelector = '.btn-quick',
  overlaySelector = '.quick-overlay',
  talkSelector = '.quick-talk',
  activeClass = 'open',
} = {}) => {
  const quickBtn = document.querySelector(buttonSelector);
  const quickOverlay = document.querySelector(overlaySelector);
  const quickTalk = document.querySelector(talkSelector);
  const btnX = document.querySelector(`${talkSelector} .btn-x`);
  
  if (!quickBtn || !quickOverlay || !quickTalk) return;

  /* 초기 상태: talk 노출, overlay 숨김 */
  quickTalk.classList.add(activeClass);
  quickBtn.classList.remove(activeClass);
  quickOverlay.classList.remove(activeClass);

  /* btn-quick 클릭 → 토글 */
  const onToggleBtn = () => {
    const isOverlayOpen = quickOverlay.classList.contains(activeClass);
    
    if (isOverlayOpen) {
      // overlay가 열려있으면 → 닫기
      quickBtn.classList.remove(activeClass);
      quickOverlay.classList.remove(activeClass);
      quickTalk.classList.add(activeClass);
      quickTalk.classList.remove('close'); // close 클래스 제거
    } else {
      // overlay가 닫혀있으면 → 열기
      quickBtn.classList.add(activeClass);
      quickOverlay.classList.add(activeClass);
      quickTalk.classList.remove(activeClass);
    }
  };

  /* overlay 클릭 → 닫기 */
  const onCloseOverlay = () => {
    quickBtn.classList.remove(activeClass);
    quickOverlay.classList.remove(activeClass);
    quickTalk.classList.add(activeClass);
    quickTalk.classList.remove('close'); // close 클래스 제거
  };

  /* quick-talk X 버튼 클릭 → talk 완전 닫기 */
  const onCloseTalk = () => {
    quickTalk.classList.remove(activeClass);
    quickTalk.classList.add('close');
    // overlay도 함께 닫기
    quickBtn.classList.remove(activeClass);
    quickOverlay.classList.remove(activeClass);
  };

  quickBtn.addEventListener('click', onToggleBtn);
  quickOverlay.addEventListener('click', onCloseOverlay);
  btnX?.addEventListener('click', onCloseTalk);

  return () => {
    quickBtn.removeEventListener('click', onToggleBtn);
    quickOverlay.removeEventListener('click', onCloseOverlay);
    btnX?.removeEventListener('click', onCloseTalk);
  };
};

/* 토스트 메세지 Toast Message */
export const toastOpen = (param, duration = 2000) => {
    let targetId = (typeof param === 'string') ? param : param.currentTarget.getAttribute("modal-id");
    const target = document.getElementById(targetId);
    
    if (!target) return;

    target.style.display = "flex";
    setTimeout(() => target.classList.add("is-active"), 100);

    setTimeout(() => {
        target.classList.remove("is-active");
        setTimeout(() => { target.style.display = "none"; }, 300);
    }, duration);
};

if (typeof window !== 'undefined') {
    window.toastOpen = toastOpen;
};


/*레벨 등급 안내 */
export const initLevelTabs = () => {
    document.addEventListener('click', (e) => {
        const tabItem = e.target.closest('.levelTab-item');
        if (!tabItem) return;

        const level = tabItem.getAttribute('data-level'); 
        const tabMenu = tabItem.closest('.levelTab-menu'); 
        const infoBox = document.querySelector('.level-infoBx');

        if (tabMenu) {
            tabMenu.classList.remove('family', 'silver', 'gold', 'vip');
            tabMenu.classList.add(level);

            const allTabs = tabMenu.querySelectorAll('.levelTab-item');
            allTabs.forEach(t => t.classList.remove('active'));
            tabItem.classList.add('active');
        }

        
        if (infoBox) {            
            infoBox.classList.remove('family', 'silver', 'gold', 'vip');
            infoBox.classList.add(level);
        }
    });
};

/*툴팁 */
export const initTooltips = () => {
    document.addEventListener('click', (e) => {
        const target = e.target;
        const icoBtn = target.closest('.ico-i');
        const activeTooltips = document.querySelectorAll('.tooltip-wrap.active');

        // 1. 아이콘 클릭 시 해당 툴팁 토글
        if (icoBtn) {
            const parent = icoBtn.closest('.tooltip-wrap');
            if (parent) {
                const isActive = parent.classList.contains('active');
                
                // 다른 열려있는 툴팁들 닫기
                activeTooltips.forEach(t => t.classList.remove('active'));
                
                // 현재 클릭한 것 토글
                if (!isActive) parent.classList.add('active');
            }
            return; // 아이콘 클릭 시 아래 '외부 클릭' 로직 타지 않게 리턴
        }

        // 2. 툴팁 내부 컨텐츠 클릭 시에는 닫히지 않도록 방지
        if (target.closest('.tooltip-content')) {
            return;
        }

        // 3. 툴팁 외부 영역 클릭 시 모든 툴팁 닫기
        activeTooltips.forEach(t => t.classList.remove('active'));
    });
};

/* 리포트 아코디언 */
export const initReportAccordion = () => {
  document.addEventListener('click', (e) => {
      const titleBtn = e.target.closest('.report-title');
      if (!titleBtn) return;

      const currentBox = titleBtn.closest('.report-box');
      const allBoxes = document.querySelectorAll('.report-box');
      const isOpen = currentBox.classList.contains('is-open');

      // 1. 모든 박스의 활성 상태 제거 (하나만 열리게 함)
      allBoxes.forEach(box => box.classList.remove('is-open'));

      // 2. 클릭한 요소가 이전에 닫혀있었다면 열기
      if (!isOpen) {
          currentBox.classList.add('is-open');
      }
  });
};

/* 건강 카드 태그 토글 */
export const initTagToggle = () => {
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.btn-tag-toggle');
        if (!toggleBtn) return;

        const parent = toggleBtn.closest('.health-card-info');
        if (!parent) return;

        const tagWrap = parent.querySelector('.card-tag-wrap');
        const isOpen = tagWrap.classList.contains('is-open');

        if (isOpen) {
            tagWrap.classList.remove('is-open');
            toggleBtn.classList.remove('is-active');
        } else {
            tagWrap.classList.add('is-open');
            toggleBtn.classList.add('is-active');
        }
    });
};

/* 다른 인증수단 토글 */
export const initAuthToggle = () => {
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.btn-auth-toggle');
        if (!toggleBtn) return;

        const parent = toggleBtn.closest('.auth-toggle-section');
        if (!parent) return;

        const authLists = parent.querySelector('.auth-item-lists');
        const isOpen = authLists.classList.contains('is-open');

        if (isOpen) {
            authLists.classList.remove('is-open');
            toggleBtn.classList.remove('is-active');
        } else {
            authLists.classList.add('is-open');
            toggleBtn.classList.add('is-active');
        }
    });
};


document.addEventListener('DOMContentLoaded', () => {
  initViewportHeight();
  headerFix();  
  fixTabOnScroll();
  quickToggle();
  initLevelTabs();
  initTooltips();
  initReportAccordion();
  initTagToggle();
  initAuthToggle();
})
