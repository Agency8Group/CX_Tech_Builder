// 타이핑 효과 관련 함수들
const loadingMessages = [
    "기술로 꿈을 현실로 만들어갑니다...",
    "10년간의 경험을 담아 설계합니다...",
    "고객 중심의 솔루션을 준비합니다...",
    "혁신적인 아이디어를 구현합니다...",
    "완벽한 사용자 경험을 만들어갑니다...",
    "미래를 위한 기술을 개발합니다...",
    "창의적인 솔루션을 찾아갑니다...",
    "품질과 속도를 모두 잡습니다...",
    "당신의 비즈니스를 성장시킵니다...",
    "더 나은 내일을 위한 기술을 만듭니다..."
];

let currentMessageIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const currentMessage = loadingMessages[currentMessageIndex];
    
    if (isDeleting) {
        // 삭제 모드
        typingElement.textContent = currentMessage.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
    } else {
        // 타이핑 모드
        typingElement.textContent = currentMessage.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100;
    }

    // 타이핑 완료 후 잠시 대기
    if (!isDeleting && currentCharIndex === currentMessage.length) {
        typingSpeed = 2000; // 2초 대기
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentMessageIndex = (currentMessageIndex + 1) % loadingMessages.length;
        typingSpeed = 500; // 다음 메시지로 넘어가기 전 0.5초 대기
    }

    setTimeout(typeText, typingSpeed);
}

// 공지사항 팝업 관련 함수들
function showNoticePopup() {
    const popup = document.getElementById('noticePopup');
    if (popup) {
        popup.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeNoticePopup() {
    const popup = document.getElementById('noticePopup');
    const dontShowAgain = document.getElementById('dontShowAgain');
    
    if (popup) {
        popup.classList.remove('show');
        document.body.style.overflow = '';
        
        // 오늘 하루 보지 않기 체크 시
        if (dontShowAgain && dontShowAgain.checked) {
            const today = new Date().toDateString();
            localStorage.setItem('noticePopupHidden', today);
        }
    }
}

// 공지사항 팝업 표시 여부 확인
function shouldShowNoticePopup() {
    const hiddenDate = localStorage.getItem('noticePopupHidden');
    const today = new Date().toDateString();
    
    return hiddenDate !== today;
}

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 타이핑 효과 시작
    setTimeout(() => {
        typeText();
    }, 500);
    
    // 공지사항 팝업 표시 (3초 후)
    setTimeout(() => {
        if (shouldShowNoticePopup()) {
            showNoticePopup();
        }
    }, 3000);
    
    // 파티클 배경 생성 (성능을 위해 지연 생성)
    setTimeout(() => {
        createParticles();
    }, 1000);
    
    // 공지사항 팝업 외부 클릭 시 닫기
    const noticePopup = document.getElementById('noticePopup');
    if (noticePopup) {
        noticePopup.addEventListener('click', function(e) {
            if (e.target === noticePopup) {
                closeNoticePopup();
            }
        });
    }
    
    // 네비게이션 스크롤 효과
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    
    // 스크롤 시 네비게이션 배경 변경
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 스무스 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들 (새로운 섹션들 추가)
    const animateElements = document.querySelectorAll('.project-card, .service-card, .contact-method, .section-header, .strength-item, .achievement-card, .skill-category');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // 통계 카운터 애니메이션
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.hero-stats');
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = stat.textContent;
                    const isPercentage = target.includes('%');
                    const isYear = target.includes('년');
                    const isLines = target.includes('줄');
                    const numericValue = parseInt(target.replace(/[^\d]/g, ''));
                    
                    if (isPercentage || isYear || isLines) {
                        animateCounter(stat, 0, numericValue, 2000, target);
                    } else {
                        animateCounter(stat, 0, numericValue, 2000, target);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // 성과 카드 애니메이션
    const achievementNumbers = document.querySelectorAll('.achievement-number');
    const aboutSection = document.querySelector('.about');
    
    const achievementObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                achievementNumbers.forEach(achievement => {
                    const target = achievement.textContent;
                    const isLines = target.includes('줄');
                    const numericValue = parseInt(target.replace(/[^\d]/g, ''));
                    
                    animateCounter(achievement, 0, numericValue, 2500, target);
                });
                achievementObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    if (aboutSection) {
        achievementObserver.observe(aboutSection);
    }
    
    // 스킬 바 애니메이션
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.querySelector('.skills');
    
    const skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 200);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
    
    function animateCounter(element, start, end, duration, originalText) {
        const startTime = performance.now();
        const isPercentage = originalText.includes('%');
        const isYear = originalText.includes('년');
        const isLines = originalText.includes('줄');
        const isPlus = originalText.includes('+');
        
        let suffix = '';
        if (isPercentage) suffix = '%';
        else if (isYear) suffix = '년';
        else if (isLines) suffix = '줄';
        else if (isPlus) suffix = '+';
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 이징 함수 적용
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const current = Math.floor(start + (end - start) * easeOutQuart);
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // 이미지와 영상 토글 함수
    window.toggleMedia = function(projectCard) {
        const projectImage = projectCard.querySelector('.project-image');
        const img = projectImage.querySelector('img');
        const video = projectImage.querySelector('video');
        
        if (img && video) {
            // 현재 이미지의 opacity 상태 확인 (기본값은 '1')
            const currentImgOpacity = img.style.opacity || '1';
            
            if (currentImgOpacity === '0') {
                // 이미지로 전환
                img.style.opacity = '1';
                video.style.opacity = '0';
                video.pause();
                video.currentTime = 0;
                console.log('이미지로 전환됨');
            } else {
                // 영상으로 전환
                img.style.opacity = '0';
                video.style.opacity = '1';
                
                // 비디오 재생 시도
                try {
                    video.play().then(() => {
                        console.log('비디오 재생 성공');
                    }).catch(error => {
                        console.log('비디오 자동 재생 실패:', error);
                        showNotification('영상을 수동으로 재생해주세요.', 'info');
                    });
                } catch (error) {
                    console.log('비디오 재생 오류:', error);
                    showNotification('영상을 수동으로 재생해주세요.', 'info');
                }
            }
        }
    };
    
    // 파티클 생성 함수
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);
        
        for (let i = 0; i < 30; i++) { // 파티클 수 줄여서 성능 개선
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // 랜덤 크기와 위치
            const size = Math.random() * 4 + 2;
            const x = Math.random() * window.innerWidth;
            const delay = Math.random() * 20;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                animation-delay: ${delay}s;
            `;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // 마우스 움직임에 따른 파티클 효과
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 마우스 주변에 파티클 생성
        if (Math.random() < 0.1) {
            createMouseParticle(mouseX, mouseY);
        }
    });
    
    function createMouseParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: rgba(56, 178, 172, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${x}px;
            top: ${y}px;
            animation: mouseParticle 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            document.body.removeChild(particle);
        }, 1000);
    }
    
    // 마우스 파티클 애니메이션 CSS 추가
    const mouseParticleStyle = document.createElement('style');
    mouseParticleStyle.textContent = `
        @keyframes mouseParticle {
            0% {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
            100% {
                transform: scale(0) translateY(-20px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(mouseParticleStyle);
    
    // Google Apps Script URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweYdsXKFA7VAxqgAqlwzzar3uUDys30NmXJ4XdT5bmHfdnv9bn3Wkh9Awrd1SjqGEg/exec';
    
    // 폼 제출 처리
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // 버튼 비활성화 및 로딩 표시
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';
            
            try {
                // 폼 데이터 수집
                const formData = new FormData(this);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    company: formData.get('company'),
                    message: formData.get('message'),
                    timestamp: new Date().toISOString()
                };
                
                // 유효성 검사
                if (!data.name || !data.email || !data.message) {
                    showNotification('모든 필수 항목을 입력해주세요.', 'error');
                    return;
                }
                
                if (!isValidEmail(data.email)) {
                    showNotification('올바른 이메일 주소를 입력해주세요.', 'error');
                    return;
                }
                
                console.log('전송할 데이터:', data);
                
                // Google Apps Script 호출
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    body: JSON.stringify(data)
                });
                
                // 성공 처리
                showNotification('✅ 문의가 성공적으로 전송되었습니다! 빠른 시일 내에 연락드리겠습니다.', 'success');
                this.reset();
                
            } catch (error) {
                console.error('전송 오류:', error);
                showNotification(`❌ 오류: ${error.message}`, 'error');
            } finally {
                // 버튼 상태 복구
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
    
    // 이메일 유효성 검사
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 알림 표시 함수
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 스타일 추가
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        `;
        
        // 타입별 색상
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
        }
        
        document.body.appendChild(notification);
        
        // 애니메이션
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 자동 제거
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 프로젝트 카드 호버 효과
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // 서비스 카드 호버 효과
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // 버튼 호버 효과
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 모달 관련 요소들
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = document.querySelector('.close');
    
    // 모든 모달 닫기 함수
    function closeAllModals() {
        const imageModal = document.getElementById('imageModal');
        const galleryModal = document.getElementById('galleryModal');
        const videoModal = document.getElementById('videoModal');
        
        if (imageModal && imageModal.style.display === 'block') {
            closeModal();
        }
        if (galleryModal && galleryModal.style.display === 'block') {
            closeGallery();
        }
        if (videoModal && videoModal.style.display === 'flex') {
            closeVideo();
        }
    }
    
    // 크게보기 버튼 클릭 이벤트
    const demoButtons = document.querySelectorAll('.btn-outline');
    demoButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 다른 모달들 먼저 닫기
            closeAllModals();
            
            const projectCard = this.closest('.project-card');
            const projectImage = projectCard.querySelector('.project-image img');
            const projectTitle = projectCard.querySelector('h3').textContent;
            const projectDescription = projectCard.querySelector('p').textContent;
            
            // 모달에 정보 설정
            modalImage.src = projectImage.src;
            modalImage.alt = projectImage.alt;
            modalTitle.textContent = projectTitle;
            modalDescription.textContent = projectDescription;
            
            // 모달 표시
            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // 스크롤 방지
            document.body.style.overflow = 'hidden';
        });
    });
    
    // 모달 닫기 버튼
    closeBtn.addEventListener('click', function() {
        closeModal();
    });
    
    // 모달 배경 클릭 시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC 키로 모달 닫기 (통합 처리)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // 열려있는 모달 확인하고 닫기
            const imageModal = document.getElementById('imageModal');
            const galleryModal = document.getElementById('galleryModal');
            const videoModal = document.getElementById('videoModal');
            
            if (videoModal && videoModal.style.display === 'flex') {
                closeVideo();
            } else if (galleryModal && galleryModal.style.display === 'block') {
                closeGallery();
            } else if (imageModal && imageModal.style.display === 'block') {
                closeModal();
            }
        }
    });
    
    // 모달 닫기 함수
    function closeModal() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // 연락처 링크 클릭 이벤트
    const contactLinks = document.querySelectorAll('.contact-details a');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const method = this.closest('.contact-method').querySelector('h4').textContent;
            showNotification(`${method}로 연결됩니다.`, 'info');
        });
    });
    
    // 로딩 완료 후 애니메이션 시작
    window.addEventListener('load', function() {
        // 로딩 오버레이 제거
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            setTimeout(() => {
                document.body.classList.add('loaded');
                // 오버레이 완전 제거
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 500);
            }, 300); // 최소 로딩 시간
        }
        
        // Hero 섹션 요소들 애니메이션 (더 부드럽게)
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-stats, .hero-buttons');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 500 + index * 150); // 로딩 완료 후 시작
        });
        
        // 플로팅 카드 애니메이션
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 1200 + index * 200);
        });
    });
    
    // 초기 스타일 설정 (깜빡임 방지를 위해 더 부드럽게)
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-stats, .hero-buttons');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)'; // 더 작은 움직임
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)'; // 더 작은 움직임
        el.style.transition = 'opacity 1s ease, transform 1s ease';
    });
    

    
    // 터치 디바이스 지원
    if ('ontouchstart' in window) {
        document.querySelectorAll('.project-card, .service-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // 성능 최적화를 위한 스크롤 쓰로틀링
    let ticking = false;
    function updateOnScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                // 스크롤 관련 업데이트 로직
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll);
    
    // 카카오톡 홍보 멘트 복사 기능
    window.copyPromoMessage = function() {
        const promoText = `안녕하세요.
고객 중심 기술 솔루션을 설계·개발하는 CX_Tech_Builder입니다.

저는 10년 이상 고객센터, 기술지원, 물류 운영 현장을 직접 구축하며,
비즈니스의 실전 문제들을 기술로 해결해온 경험을 가지고 있습니다.

이제는 그 경험을 바탕으로,
소상공인과 스타트업을 위한 맞춤형 웹 기반 프로그램 및 랜딩페이지를 제작해드리고 있습니다.

수백만 원대 외주가 부담스러우셨다면,
현장에서 검증된 실용형 솔루션을 단 몇십만 원 수준에서 경험해보실 수 있습니다.

해당 가격은 제가 현재도 직장에 재직 중인 상황에서,
개발에만 몰입하기보다는 사용자 입장에서의 실질적 효율과 커뮤니케이션을 중요시하며,
현실적인 비용으로 빠르고 정확한 서비스를 제공해드리기 위한 선택입니다.

유지보수와 소통 또한 빈틈없이 지원해드리므로,
단순 제작이 아닌 지속 가능한 디지털 파트너십을 경험하실 수 있습니다.

작업 사례와 서비스 소개는 아래 링크에서 확인하실 수 있습니다👇
👉 https://agency8group.github.io/CX_Tech_Builder/

혹시 "우리도 이런 게 하나 필요했는데..." 싶은 생각이 드신다면,
언제든 편하게 말씀 주세요.
기획부터 개발, 운영까지, 함께 고민하고 제안드리겠습니다.

감사합니다.
CX_Tech_Builder – 경험을 기술로, 고객을 중심에.`;

        navigator.clipboard.writeText(promoText).then(function() {
            showNotification('✅ 홍보 멘트가 클립보드에 복사되었습니다!', 'success');
        }).catch(function(err) {
            console.error('복사 실패:', err);
            showNotification('❌ 복사에 실패했습니다. 수동으로 복사해주세요.', 'error');
        });
    };
    
    // 스크롤 진행률 표시
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #38b2ac, #1a365d);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
    
    console.log('포트폴리오 웹사이트가 성공적으로 로드되었습니다! 🚀');

    // 갤러리 데이터
    const galleryData = {
        '고객센터': {
            images: [
                {
                    src: '업무TOOL소개/web고객센터(1).png',
                    title: '웹AI 고객센터 구축 - 메인 화면',
                    description: '인공지능 기반 고객 응대 자동화 시스템의 메인 인터페이스'
                },
                {
                    src: '업무TOOL소개/web고객센터(2).png',
                    title: '웹AI 고객센터 구축 - 대화 인터페이스',
                    description: '실시간 AI 챗봇을 통한 고객 문의 자동 응대 시스템'
                }
            ]
        }
    };

    // 갤러리 전역 변수
    let currentGallery = null;
    let currentImageIndex = 0;

    // 갤러리 열기 함수
    window.openGallery = function(galleryName) {
        if (galleryData[galleryName]) {
            // 다른 모달들 먼저 닫기
            closeAllModals();
            
            currentGallery = galleryName;
            currentImageIndex = 0;
            updateGalleryImage();
            
            const galleryModal = document.getElementById('galleryModal');
            galleryModal.style.display = 'block';
            galleryModal.classList.add('show');
            
            // 스크롤 방지
            document.body.style.overflow = 'hidden';
        }
    };

    // 갤러리 이미지 변경 함수
    window.changeGalleryImage = function(direction) {
        if (!currentGallery) return;
        
        const gallery = galleryData[currentGallery];
        currentImageIndex += direction;
        
        // 순환 처리
        if (currentImageIndex < 0) {
            currentImageIndex = gallery.images.length - 1;
        } else if (currentImageIndex >= gallery.images.length) {
            currentImageIndex = 0;
        }
        
        updateGalleryImage();
    };

    // 갤러리 이미지 업데이트 함수
    function updateGalleryImage() {
        if (!currentGallery) return;
        
        const gallery = galleryData[currentGallery];
        const currentImage = gallery.images[currentImageIndex];
        
        const galleryImage = document.getElementById('galleryImage');
        const galleryTitle = document.getElementById('galleryTitle');
        const galleryDescription = document.getElementById('galleryDescription');
        const galleryCounter = document.getElementById('galleryCounter');
        
        galleryImage.src = currentImage.src;
        galleryImage.alt = currentImage.title;
        galleryTitle.textContent = currentImage.title;
        galleryDescription.textContent = currentImage.description;
        galleryCounter.textContent = `${currentImageIndex + 1} / ${gallery.images.length}`;
    }

    // 갤러리 닫기 함수
    window.closeGallery = function() {
        const galleryModal = document.getElementById('galleryModal');
        if (galleryModal) {
            galleryModal.classList.remove('show');
            galleryModal.style.display = 'none';
            
            // 스크롤 복원
            document.body.style.overflow = 'auto';
            
            currentGallery = null;
            currentImageIndex = 0;
        }
    };

    // 갤러리 모달 외부 클릭 시 닫기
    document.getElementById('galleryModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeGallery();
        }
    });

    // 키보드 이벤트 (좌우 화살표로 이미지 변경)
    document.addEventListener('keydown', function(e) {
        if (currentGallery) {
            if (e.key === 'ArrowLeft') {
                changeGalleryImage(-1);
            } else if (e.key === 'ArrowRight') {
                changeGalleryImage(1);
            }
            // ESC 키는 상단의 통합 처리에서 처리됨
        }
    });

    // 비디오 모달 관련 함수들
    window.openVideo = function(videoSrc, title, description) {
        // 다른 모달들 먼저 닫기
        closeAllModals();
        
        const videoModal = document.getElementById('videoModal');
        const modalVideo = document.getElementById('modalVideo');
        const videoTitle = document.getElementById('videoTitle');
        const videoDescription = document.getElementById('videoDescription');
        
        // 비디오 소스 설정
        modalVideo.querySelector('source').src = videoSrc;
        modalVideo.load(); // 비디오 다시 로드
        
        // 제목과 설명 설정
        videoTitle.textContent = title;
        videoDescription.textContent = description;
        
        // 모달 표시
        videoModal.style.display = 'flex';
        videoModal.classList.add('show');
        
        // body 스크롤 방지
        document.body.style.overflow = 'hidden';
        
        // 비디오 자동 재생 시도
        setTimeout(() => {
            modalVideo.play().catch(error => {
                console.log('비디오 자동 재생 실패:', error);
            });
        }, 100);
    };
    
    window.closeVideo = function() {
        const videoModal = document.getElementById('videoModal');
        const modalVideo = document.getElementById('modalVideo');
        
        if (videoModal && modalVideo) {
            // 비디오 정지
            modalVideo.pause();
            modalVideo.currentTime = 0;
            
            // 모달 숨기기
            videoModal.classList.remove('show');
            videoModal.style.display = 'none';
            
            // body 스크롤 복원
            document.body.style.overflow = 'auto';
        }
    };
    
    // 비디오 모달 외부 클릭 시 닫기
    document.getElementById('videoModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeVideo();
        }
    });
    
    // ESC 키는 상단의 통합 처리에서 처리됨 (중복 제거)
}); 