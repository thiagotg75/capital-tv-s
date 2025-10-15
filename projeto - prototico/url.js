function carregar() {
    fetch('urls.php')
    .then(r => r.json())
    .then(d => {
        if (d.success) {
            document.getElementById('urlsBox').value = d.urls.join('\n');
        } else {
            document.getElementById('msg').textContent = d.msg;
        }
    });
}

function salvar() {
    const urls = document.getElementById('urlsBox').value;
    const form = new FormData();
    form.append('urls', urls);

    fetch('urls.php', { method: 'POST', body: form })
    .then(r => r.json())
    .then(d => {
        const msg = document.getElementById('msg');
        msg.textContent = d.msg;
        msg.className = d.success ? 'success' : 'error';
        if (d.success) {
            fetch('reset.php'); // chama reset do feh
        }
    });
}

function removertodos(){
    if(!confirm('Remover todas as URLs? Essa ação não pode ser desfeita.')) return;
    const form = new FormData();
    form.append('action','clear');
    fetch('urls.php',{method:'POST', body: form})
    .then(r=>r.json())
    .then(d=>{
        const msg = document.getElementById('msg');
        msg.textContent = d.msg;
        msg.className = d.success ? 'success' : 'error';
        if(d.success){
            document.getElementById('urlsBox').value = '';
            fetch('reset.php');
        }
    });
}

carregar();