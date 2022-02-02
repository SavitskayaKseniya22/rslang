import ApiService from "../../api-service/api-service"
import "./text-book-page.css"

class TextBookPage{
    service: ApiService
    constructor(service: ApiService){
        this.service = service
    }
    render(){
        document.querySelector('.main').innerHTML = `<div class="textbook-container">
        <div class="tb-mini-game-select">
            <div class="tb-minigame"><i class="fas fa-running"></i> sprint</div>
            <div class="tb-minigame"><i class="fas fa-volume-up"></i> audio-challenge</div>
        </div>
        <div class="tb-pagination">
            <button class="pagination-button pagination-left"><i class="fas fa-caret-left"></i></button>
            <div class="page-num">1</div>
            <button class="pagination-button pagination-right"><i class="fas fa-caret-right"></i></button>
        </div>
        <div class="tb-group-select">
        <p>groups</p>
            <div class="group-select tb-group-selected" data-grp="0">1</div>
            <div class="group-select" data-grp="1">2</div>
            <div class="group-select" data-grp="2">3</div>
            <div class="group-select" data-grp="3">4</div>
            <div class="group-select" data-grp="4">5</div>
            <div class="group-select" data-grp="5">6</div>
        </div>
        <div class="tb-words">
            <div class="tb-word" data-tb-wrd-id="0">
                <div class="tb-img"></div>
                <div class="tb-word-info">
                <div class="tb-word-title-translation-pronounciation">
                    <h3 class="tb-word-title">place [pleis]</h3>
                    <h3 class="tb-word-translation"></h3>
                    <button class="pronounce" data-tb-audio-id="0"><i class="fas fa-volume-up"></i></button>
                </div>
                <div class="tb-word-definition">
                    <p class="tb-definition-english">lorem ipsum</p>
                    <p class="tb-definition-translation">dolor sit amen</p>
                </div>
                <div class="tb-word-sentence">
                    <p class="tb-sentence-english">lorem ipsum</p>
                    <p class="tb-sentence-translation">dolor sit amen</p>
                </div>
                </div>
            </div>
        </div>
        
        
    </div>`
    }
}

export default TextBookPage