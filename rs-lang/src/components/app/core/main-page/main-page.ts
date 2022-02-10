import './main-page.css'

class MainPage {
  render() {
    document.querySelector('.header-page-title').textContent = 'Main Page'
    document.querySelector('.main').innerHTML = `
        <div class="main-page-container">
        <section class="main-section">
        <div class="app-logo"></div>
        <h1>Awesome language learning app</h1>
        <a href="#book" class="button-yellow">Open textbook</a>
    </section>
    <section class="main-section">
        <h2>Features</h2>
        <div class="main-feature-list">
            <div class="main-feature">
                <div class="feature-symbol"></div>
                <h3>Textbook</h3>
                <p>3600 of the most commonly used english words are organised in 6 sections of 30 20 word pages for a
                    convenient and measured learning experience. Don't hesitate to mark words as "difficult" or "learned
                    to better track your progress!"</p>
            </div>
            <div class="main-feature">
                <div class="feature-symbol"></div>
                <h3>Sprint mini-game</h3>
                <p>challenge your wit and knowledge in a fast paced and rewarding guessing game!</p>
            </div>

            <div class="main-feature">
                <div class="feature-symbol"></div>
                <h3>Audio Challenge mini-game</h3>
                <p>train your ear as well as your eyes to recognise english speech </p>
            </div>
            <div class="main-feature">
                <div class="feature-symbol"></div>
                <h3>Statistics</h3>
                <p> your progress is monitored and logged. Be sure to take a look at it once in a while to make sure you
                    are on track!</p>
            </div>
        </div>
    </section>
    <section class="main-section">
        <h2> Meet the team</h2>
        <div class="main-team-list">
            <div class="main-team-membrer">
                <div class="team-member-image"></div>
                <div class="team-member-info">
                    <h3>Name</h3>
                    <p>job descriptor</p>
                    <p>Feature list</p>
                </div>
            </div>
            <div class="main-team-membrer">
                <div class="team-member-image"></div>
                <div class="team-member-info">
                    <h3>Name</h3>
                    <p>job descriptor</p>
                    <p>Feature list</p>
                </div>
            </div>
            <div class="main-team-membrer">
                <div class="team-member-image"></div>
                <div class="team-member-info">
                    <h3>Name</h3>
                    <p>job descriptor</p>
                    <p>Feature list</p>
                </div>
            </div>
        </div>
    </section>
    </div>
        `
  }
}
export default MainPage
