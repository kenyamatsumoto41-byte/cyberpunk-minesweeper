// GSAPプラグインの登録
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. JSONデータの取得と表示
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderWorks(data.works);
            renderPlayground(data.playground);
            
            // データ描画後にアニメーションを設定
            initScrollAnimations();
        })
        .catch(error => console.error('Error fetching data:', error));

    // 2. カスタムカーソルの制御
    initCursor();
});

// Worksの描画関数（リンク付きに変更版）
function renderWorks(works) {
    const container = document.getElementById('works-container');
    works.forEach(work => {
        // articleタグを aタグに変更し、href属性を追加
        // target="_blank" を入れると、別タブで開きます（ポートフォリオでは推奨）
        const html = `
            <a href="${work.url}" target="_blank" class="work-item hover-trigger">
                <img src="${work.image}" alt="${work.title}" class="work-img">
                <div class="work-content">
                    <span class="work-cat">${work.category}</span>
                    <h3 class="work-title">${work.title}</h3>
                    <p class="work-desc">${work.description}</p>
                </div>
            </a>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// Playgroundの描画関数（リンク付きに変更版）
function renderPlayground(items) {
    const container = document.getElementById('playground-container');
    items.forEach(item => {
        // ここもURLがあれば飛べるように設定
        // data.jsonのplayground側にも "url": "..." を追加するのを忘れずに！
        const linkTag = item.url ? `<a href="${item.url}" target="_blank" class="work-item hover-trigger">` : `<div class="work-item hover-trigger">`;
        const endTag = item.url ? `</a>` : `</div>`;

        const html = `
            ${linkTag}
                <img src="${item.image}" alt="${item.title}" class="work-img">
                <div class="work-content">
                    <span class="work-cat">${item.category}</span>
                    <h3 class="work-title">${item.title}</h3>
                </div>
            ${endTag}
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// 3. GSAPスクロールアニメーション
function initScrollAnimations() {
    // Bento Grid（ヒーローエリア）の出現
    gsap.from('.card', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2, // 順番に出現
        ease: 'power3.out'
    });

    // Works & Playgroundリストの出現
    gsap.utils.toArray('.works-grid, .playground-grid').forEach(grid => {
        const items = grid.querySelectorAll('.work-item');
        
        gsap.to(items, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1, // ドミノ倒し効果
            scrollTrigger: {
                trigger: grid,
                start: 'top 80%', // 画面の80%の位置に来たら発火
                toggleActions: 'play none none none'
            }
        });
    });
}

// 4. カスタムカーソル実装
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    // マウスの動きに追従
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 }); // 少し遅れて追従
    });

    // ホバー時のエフェクト（マグネット効果風）
    // 動的に追加された要素にも反応させるため、bodyにイベント委譲
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest('.hover-trigger') || e.target.closest('a') || e.target.closest('button')) {
            cursor.classList.add('active');
            follower.classList.add('active');
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (e.target.closest('.hover-trigger') || e.target.closest('a') || e.target.closest('button')) {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        }
    });
}