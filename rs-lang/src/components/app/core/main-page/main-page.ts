import './main-page.css'

class MainPage {
  render() {
    document.querySelector('.main').innerHTML = `
        <div class="main-page-container">
        <section class="main-section">
        <div class="app-logo"></div>
        <h1>Awesome language learning app</h1>
    </section>
    <section class="main-section">
        <h2>Features</h2>
        <div class="main-feature-list">
            <div class="main-feature">
                <div class="feature-symbol"><i class="fa-solid fa-book"></i></div>
                <a href="#text-book" class="page-link"><h3>Textbook</h3></a>
                <p>3600 of the most commonly used english words are organised in 6 sections of 30 20 word pages for a
                    convenient and measured learning experience. Don't hesitate to mark words as "difficult" or "learned
                    to better track your progress!"</p>
            </div>
            <div class="main-feature">
                <div class="feature-symbol"><i class="fa-solid fa-stopwatch"></i></div>
                <a href="#sprint-choose" class="page-link "><h3>Sprint</h3></a>
                
                <p>challenge your wit and knowledge in a fast paced and rewarding guessing game!</p>
            </div>

            <div class="main-feature">
                <div class="feature-symbol"><i class="fa-solid fa-music"></i></div>
                <a href="#audio-challenge-choose" class="page-link"><h3>Audio Challenge</h3></a>
                
                <p>train your ear as well as your eyes to recognise english speech </p>
            </div>
            <div class="main-feature">
                <div class="feature-symbol"><i class="fa-solid fa-table"></i></div>
                <a href="#statistics" class="page-link"><h3>Statistics</h3></a>
                <p> your progress is monitored and logged. Be sure to take a look at it once in a while to make sure you
                    are on track!</p>
            </div>
        </div>
    </section>
    <section class="main-section">
        <h2> Meet the team</h2>
        <div class="main-team-list">
                <div class="team-member-info">
                    <h3>Kseniya Savitskaya</h3>
                    <img class="team-member-image" src="./images/ava-2.jpg" alt="avatar">
                    <ul>
                    <li>"Sprint" game</li>
                    <li>Page design and layout</li>
                    </ul>
                </div>
                <div class="team-member-info">
                    <h3>Nikita Kravchenko</h3>
                    <img class="team-member-image" src="./images/The_Almighty_Loaf.jpg" alt="avatar">
                    <ul>
                    <li><b>Team lead</b></li>
                    <li>Authorization</li>
                    <li>Textbook</li>
                    </ul>
                </div>
                <div class="team-member-info">
                    <h3>Yauheny Bychkou</h3>
                    <img class="team-member-image" src="./images/ava.jpg" alt="avatar">
                    <ul>
                    <li>"Audiocall" game</li>
                    <li>Statistics</li>
                    </ul>
                </div>
        </div>
    </section>
    </div>
        `
  }
}
export default MainPage
