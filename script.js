// Funkce pro načtení dat z CoinGecko API
async function fetchCryptoData() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Chyba při načítání dat:', error);
        return [];
    }
}

// Funkce pro výběr top 3 kryptoměn podle 24h změny
function getTop3Cryptos(data) {
    return data
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 3);
}

// Funkce pro zobrazení kryptoměn
function displayCryptos(cryptos) {
    const cryptoList = document.getElementById('crypto-list');
    cryptoList.innerHTML = ''; // Vyčisti seznam

    cryptos.forEach(crypto => {
        const card = document.createElement('div');
        card.classList.add('crypto-card');

        const changeClass = crypto.price_change_percentage_24h >= 0 ? 'change-positive' : 'change-negative';
        card.innerHTML = `
            <h2>${crypto.name}</h2>
            <p class="price">$${crypto.current_price.toFixed(2)}</p>
            <p class="${changeClass}">
                24h změna: ${crypto.price_change_percentage_24h.toFixed(2)}%
            </p>
            <p>Tržní kapitalizace: $${crypto.market_cap.toLocaleString()}</p>
        `;
        cryptoList.appendChild(card);
    });
}

// Funkce pro aktualizaci času
function updateLastUpdated() {
    const lastUpdated = document.getElementById('last-updated');
    const now = new Date().toLocaleString('cs-CZ');
    lastUpdated.textContent = `Poslední aktualizace: ${now}`;
}

// Hlavní funkce pro aktualizaci dat
async function updateData() {
    const data = await fetchCryptoData();
    if (data.length > 0) {
        const top3 = getTop3Cryptos(data);
        displayCryptos(top3);
        updateLastUpdated();
    }
}

// Spusť aktualizaci při načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    updateData();

    // Automatická aktualizace každých 24 hodin
    setInterval(updateData, 24 * 60 * 60 * 1000);

    // Tlačítko pro ruční aktualizaci
    document.getElementById('refresh-btn').addEventListener('click', updateData);
});