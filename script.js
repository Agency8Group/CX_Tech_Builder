// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 네비게이션 스크롤 효과
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // 스크롤 시 네비게이션 배경 변경
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // 모바일 햄버거 메뉴
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 네비게이션 링크 클릭 시 모바일 메뉴 닫기
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
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
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animateElements = document.querySelectorAll('.project-card, .service-card, .contact-method');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
                    const numericValue = parseInt(target.replace(/[^\d]/g, ''));
                    
                    if (isPercentage || isYear) {
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
    
    function animateCounter(element, start, end, duration, originalText) {
        const startTime = performance.now();
        const isPercentage = originalText.includes('%');
        const isYear = originalText.includes('년');
        const suffix = isPercentage ? '%' : isYear ? '년' : '+';
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
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
        `;
        
        // 타입별 색상
        if (type === 'success') {
            notification.style.background = '#10b981';
        } else if (type === 'error') {
            notification.style.background = '#ef4444';
        } else {
            notification.style.background = '#2563eb';
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
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 서비스 카드 호버 효과
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 모달 관련 요소들
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = document.querySelector('.close');
    
    // 크기보기 버튼 클릭 이벤트
    const demoButtons = document.querySelectorAll('.btn-outline');
    demoButtons.forEach(button => {
        button.addEventListener('click', function() {
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
            modal.classList.add('show');
            
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
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // 모달 닫기 함수
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
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
        document.body.style.opacity = '1';
        
        // Hero 섹션 요소들 애니메이션
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-stats, .hero-buttons');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
    
    // 초기 스타일 설정
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-stats, .hero-buttons');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // 모바일 메뉴 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 70px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 70px);
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 50px;
                transition: left 0.3s ease;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .nav-menu li {
                margin: 20px 0;
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(style);
    
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
    
    console.log('포트폴리오 웹사이트가 성공적으로 로드되었습니다! 🚀');
}); 