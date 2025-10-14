async function populateCards() {
  let cards = [];
  try {
    const data = await fetch("config.json")
    cards = await data.json()
    if (!Array.isArray(cards)) throw new Error("Formato inválido do config.json")
  } catch (err) {
    console.error("Erro ao buscar config.json:", err)
    return;
  }
  const container = document.getElementById("cardContainer")
  if (!container) {
    console.error("Elemento cardContainer não encontrado.")
    return;
  }
  container.innerHTML = "";
  const grouped = {};
  cards.forEach(card => {
    if (!card.title || !card.ipAddress) return;
    if (!grouped[card.title]) grouped[card.title] = []
    grouped[card.title].push(card.ipAddress);
  });
  Object.entries(grouped).forEach(([title, ips]) => {
    const section = document.createElement("article")
    section.className = "card-section";
    section.innerHTML = `<h3>${title}</h3>`
    ips.forEach(ip => {
      const card = document.createElement("article")
      card.className = "card-1";
      card.innerHTML = `
        <img class="img" src="http://${ip}/screenshot.png" />
        <button class="reset" type="button" data-ip="${ip}"><svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-repeat"
          viewBox="0 0 16 16"
        >
          <path
            d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
          ></path>
          <path
            fill-rule="evenodd"
            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
          ></path>
        </svg>
        <span>Reset</span>
        </button>
        
<button class="btn-add"><a href="http://${ip}/url.html">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20" fill="none" class="svg-icon"><g stroke-width="1.5" stroke-linecap="round" stroke="#2a96deff"><circle r="7.5" cy="10" cx="10"></circle><path d="m9.99998 7.5v5"></path><path d="m7.5 9.99998h5"></path></g></svg>
  <span>Enviar URL</span>
</a></button>
      `;
      const btn = card.querySelector('button.reset');
      if (btn) {
        btn.addEventListener('click', function() {
          resetTv(ip, title);
        })
      }
      section.appendChild(card)
    })
    container.appendChild(section)
  })
}



function resetTv(ip, title) {
    showCustomAlert(title)
    setTimeout(() => {
      window.location.href = `http://${ip}/reset.php`
    }, 1000)
}

function showCustomAlert(title) {
    const alertContainer = document.getElementById('alert-container')
    if (!alertContainer) return;
    alertContainer.innerHTML = `
      <div class="error-alert">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="error-svg">
              <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill-rule="evenodd"></path>
            </svg>
          </div>
          <div class="error-prompt-container">
            <p class="error-prompt-heading">RESET PARA TV</p>
            <div class="error-prompt-wrap">
              <ul class="error-prompt-list" role="list">
                <li>Reset solicitado para a tv: <b>${title}</b></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `
    alertContainer.style.display = 'flex'
    setTimeout(() => {
      alertContainer.style.display = 'none'
    }, 1000)
}

const btn = document.getElementById("contraste");

btn.addEventListener("click", function() {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  } 
  else {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
  }
});
async function enviarURL() {
      const url = document.getElementById("url").value;
      if (!url) return alert("Digite uma URL");

      const formData = new FormData();
      formData.append("url", url);

      const resposta = await fetch("http://172.16.14.165/feh.status.php", {
        method: "POST",
        body: formData
      });

      const texto = await resposta.text();
      document.getElementById("saida").innerHTML = texto;
    }

function resetCountdown() {
  let count = 60 // 1 min - tempo para reinicar a página
  const timerElement = document.getElementById("segundosRestantes")
  if (!timerElement) return;
  if (window._resetCountdownInterval) clearInterval(window._resetCountdownInterval);
  window._resetCountdownInterval = setInterval(() => {
    timerElement.textContent = `Atualizando a página em ${count} segundos.`
    count--
    if (count < 0) {
      clearInterval(window._resetCountdownInterval);
      window.location.reload()
    }
  }, 1000)
}

 
document.addEventListener("DOMContentLoaded", () => {
  populateCards()
  resetCountdown()
})
