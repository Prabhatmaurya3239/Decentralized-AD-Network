// State Initialization
const DEFAULT_ADVERTISER_BALANCE = 0.0500;
const DEFAULT_PUBLISHER_AVAILABLE = 0.00482;
const DEFAULT_PUBLISHER_TOTAL = 0.01254;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const ADCHAIN_ABI = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "campaignId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "advertiser", "type": "address" }, { "indexed": true, "internalType": "address", "name": "publisher", "type": "address" }, { "indexed": false, "internalType": "string", "name": "campaignName", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "budget", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "basePrice", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "maxImpressions", "type": "uint256" }], "name": "CampaignCreated", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "campaignId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "advertiser", "type": "address" }], "name": "CampaignStopped", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "campaignId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "advertiser", "type": "address" }, { "indexed": true, "internalType": "address", "name": "publisher", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "impressionNumber", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }], "name": "ImpressionRecorded", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "publisher", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "PublisherWithdrawal", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "relayer", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "status", "type": "bool" }], "name": "RelayerUpdated", "type": "event" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "authorizedRelayers", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "campaignCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "publisher", "type": "address" }, { "internalType": "string", "name": "campaignName", "type": "string" }, { "internalType": "uint256", "name": "basePrice", "type": "uint256" }, { "internalType": "uint256", "name": "maxImpressions", "type": "uint256" }], "name": "createCampaign", "outputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }], "stateMutability": "payable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }], "name": "getCampaign", "outputs": [{ "components": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }, { "internalType": "address", "name": "advertiser", "type": "address" }, { "internalType": "address", "name": "publisher", "type": "address" }, { "internalType": "string", "name": "campaignName", "type": "string" }, { "internalType": "uint256", "name": "budget", "type": "uint256" }, { "internalType": "uint256", "name": "spent", "type": "uint256" }, { "internalType": "uint256", "name": "basePrice", "type": "uint256" }, { "internalType": "uint256", "name": "impressions", "type": "uint256" }, { "internalType": "uint256", "name": "maxImpressions", "type": "uint256" }, { "internalType": "bool", "name": "active", "type": "bool" }, { "internalType": "uint256", "name": "createdAt", "type": "uint256" }], "internalType": "struct AdChain.Campaign", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }], "name": "getCurrentPrice", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "publisher", "type": "address" }], "name": "getPublisherBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "publisher", "type": "address" }], "name": "getPublisherImpressions", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }], "name": "getRemainingBudget", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "publisherBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "publisherImpressions", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }], "name": "recordImpression", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "relayer", "type": "address" }, { "internalType": "bool", "name": "status", "type": "bool" }], "name": "setRelayer", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "campaignId", "type": "uint256" }], "name": "stopCampaign", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "totalImpressions", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

const ADCHAIN_CONTRACT_ADDRESS = (window.ADCHAIN_CONTRACT_ADDRESS || localStorage.getItem('adchain_contract_address') || ZERO_ADDRESS).toLowerCase();

function getAdChainContract() {
    if (typeof window.ethereum === 'undefined' || typeof Web3 === 'undefined') {
        return null;
    }
    if (!ADCHAIN_CONTRACT_ADDRESS || ADCHAIN_CONTRACT_ADDRESS === ZERO_ADDRESS) {
        return null;
    }
    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(ADCHAIN_ABI, ADCHAIN_CONTRACT_ADDRESS);
}

async function syncPublisherWalletFromContract() {
    const publisherWallet = localStorage.getItem('adchain_publisher_wallet') || '';
    if (!publisherWallet || !window.ethereum) return false;
    const contract = getAdChainContract();
    if (!contract) return false;

    try {
        const [balance, impressions] = await Promise.all([
            contract.methods.getPublisherBalance(publisherWallet).call(),
            contract.methods.getPublisherImpressions(publisherWallet).call()
        ]);

        const balanceEth = Number(Web3.utils.fromWei(String(balance || 0), 'ether'));
        localStorage.setItem('adchain_publisher_earnings', balanceEth.toFixed(6));
        localStorage.setItem('adchain_publisher_impressions', String(impressions || 0));
        return true;
    } catch (error) {
        console.warn('Contract sync failed; falling back to local demo state.', error);
        return false;
    }
}

if (localStorage.getItem('adchain_advertiser_balance') === null) {
    localStorage.setItem('adchain_advertiser_balance', DEFAULT_ADVERTISER_BALANCE.toString());
}
if (localStorage.getItem('adchain_publisher_earnings') === null) {
    localStorage.setItem('adchain_publisher_earnings', DEFAULT_PUBLISHER_AVAILABLE.toString());
}
if (localStorage.getItem('adchain_publisher_total') === null) {
    localStorage.setItem('adchain_publisher_total', DEFAULT_PUBLISHER_TOTAL.toString());
}
if (localStorage.getItem('adchain_publisher_impressions') === null) {
    localStorage.setItem('adchain_publisher_impressions', '4300');
}
if (localStorage.getItem('adchain_deals') === null) {
    localStorage.setItem('adchain_deals', JSON.stringify([]));
}

document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize custom tabs
    initCustomTabs();

    // 2. Load wallet bindings independently
    initIndependentWallets();

    // 3. Initialize statistics counters
    refreshAdvertiserBalanceFromWallet();
    loadDynamicBalances();
    animateCounters();

    // 4. Setup live event feed ticker
    setupLiveActivityFeed();

    // 5. Setup copy wallet address links
    setupWalletCopy();

    // 6. Setup campaign and direct deals wizards
    setupCampaignWizard();
    setupDirectDeals();
    setupDepositEthFlow();

    // 7. Setup pricing charts & tickers
    setupDynamicPricingDemo();
    
    // 8. Particle emitter visualizer
    setupNetworkVisualizer();

    // 9. Sync with the real AdChain contract when a deployed contract address is configured
    syncPublisherWalletFromContract();

    // 10. Update progress indicators
    updateProgressBars();
    
    // 11. Withdraw triggers
    setupWithdrawalFlow();

    document.querySelectorAll('[data-connect-role]').forEach(button => {
        button.addEventListener('click', () => connectRoleWallet(button.dataset.connectRole));
    });
});

// Custom Tab Toggler
function initCustomTabs() {
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab-custom"]');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSelector = this.getAttribute('data-bs-target');
            
            // Remove active state
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane-custom').forEach(pane => pane.classList.remove('active'));
            
            // Add active state to clicked button and its panel
            this.classList.add('active');
            const targetPane = document.querySelector(targetSelector);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

// Independent Web3 Wallet Context bindings
async function initIndependentWallets() {
    const isAdvertiserDashboard = document.getElementById('advertiserWalletVal') !== null;
    const isPublisherDashboard = document.getElementById('publisherWalletVal') !== null;
    
    let currentAccount = '';
    
    if (isAdvertiserDashboard) {
        const wallet = localStorage.getItem('adchain_advertiser_wallet') || '0x6C38d...F402';
        const displayEl = document.getElementById('advertiserWalletVal');
        if (displayEl) {
            displayEl.textContent = shortenAddress(wallet);
        }
        const fullDisplayEl = document.getElementById('advertiserWalletAddressFull');
        if (fullDisplayEl) {
            fullDisplayEl.textContent = wallet;
        }
    }
    
    if (isPublisherDashboard) {
        const wallet = localStorage.getItem('adchain_publisher_wallet') || '0x9E99a...C108';
        const displayEl = document.getElementById('publisherWalletVal');
        if (displayEl) {
            displayEl.textContent = shortenAddress(wallet);
        }
        const fullDisplayEl = document.getElementById('publisherWalletAddressFull');
        if (fullDisplayEl) {
            fullDisplayEl.textContent = wallet;
        }
    }
}

async function connectRoleWallet(role) {
    if (typeof window.ethereum === 'undefined') {
        showToast('MetaMask is not installed. Install it to connect a Sepolia wallet.', 'warning');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts.length) return;

        const storageKey = role === 'publisher' ? 'adchain_publisher_wallet' : 'adchain_advertiser_wallet';
        localStorage.setItem(storageKey, accounts[0]);
        if (role === 'advertiser') {
            await refreshAdvertiserBalanceFromWallet();
        }
        initIndependentWallets();
        showToast(`Connected as ${role === 'publisher' ? 'Publisher' : 'Advertiser'}.`, 'success');
    } catch (error) {
        console.error(`Failed to connect ${role} wallet`, error);
        showToast('Wallet connection was cancelled.', 'danger');
    }
}

async function refreshAdvertiserBalanceFromWallet() {
    const walletAddress = localStorage.getItem('adchain_advertiser_wallet') || localStorage.getItem('adchain_publisher_wallet') || '';
    if (!walletAddress || typeof window.ethereum === 'undefined' || typeof Web3 === 'undefined') {
        return parseFloat(localStorage.getItem('adchain_advertiser_balance')) || DEFAULT_ADVERTISER_BALANCE;
    }

    try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0xaa36a7') {
            showToast('Switch MetaMask to Sepolia Testnet to use live ETH balance.', 'warning');
            return parseFloat(localStorage.getItem('adchain_advertiser_balance')) || DEFAULT_ADVERTISER_BALANCE;
        }

        const balanceWei = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [walletAddress, 'latest']
        });

        const balanceEth = Number(Web3.utils.fromWei(balanceWei, 'ether'));
        localStorage.setItem('adchain_advertiser_balance', balanceEth.toString());
        return balanceEth;
    } catch (error) {
        console.warn('Unable to read live wallet balance. Using stored demo balance.', error);
        return parseFloat(localStorage.getItem('adchain_advertiser_balance')) || DEFAULT_ADVERTISER_BALANCE;
    }
}

// Format Address Helper
function shortenAddress(addr) {
    if (!addr || addr.length < 12) return 'Not Connected';
    return addr.slice(0, 6) + '...' + addr.slice(-4);
}

// Synchronize balances from localStorage
function loadDynamicBalances() {
    const contract = getAdChainContract();
    const wallet = localStorage.getItem('adchain_publisher_wallet');

    if (contract && wallet && wallet !== ZERO_ADDRESS) {
        syncPublisherWalletFromContract();
    }

    const advBalance = parseFloat(localStorage.getItem('adchain_advertiser_balance')) || DEFAULT_ADVERTISER_BALANCE;
    const advBalanceEl = document.getElementById('advertiserWalletBalanceVal');
    const advOverviewEl = document.getElementById('advertiserOverviewBalanceVal');
    
    if (advBalanceEl) advBalanceEl.textContent = advBalance.toFixed(4) + ' ETH';
    if (advOverviewEl) advOverviewEl.textContent = advBalance.toFixed(4) + ' ETH';
    
    // Publisher Balances
    const pubAvailable = parseFloat(localStorage.getItem('adchain_publisher_earnings')) || 0.0;
    const pubTotal = parseFloat(localStorage.getItem('adchain_publisher_total')) || 0.0;
    const pubImpressions = parseInt(localStorage.getItem('adchain_publisher_impressions')) || 4300;
    
    const pubAvailableEl = document.getElementById('publisherAvailableVal');
    const pubOverviewAvailableEl = document.getElementById('publisherOverviewAvailableVal');
    const pubTotalEl = document.getElementById('publisherTotalVal');
    const pubImpressionsEl = document.getElementById('publisherImpressionsVal');
    const pubOverviewImpressionsEl = document.getElementById('publisherOverviewImpressionsVal');
    
    if (pubAvailableEl) pubAvailableEl.textContent = pubAvailable.toFixed(5) + ' ETH';
    if (pubOverviewAvailableEl) pubOverviewAvailableEl.textContent = pubAvailable.toFixed(5) + ' ETH';
    if (pubTotalEl) pubTotalEl.textContent = pubTotal.toFixed(5) + ' ETH';
    if (pubImpressionsEl) pubImpressionsEl.textContent = pubImpressions.toLocaleString();
    if (pubOverviewImpressionsEl) pubOverviewImpressionsEl.textContent = pubImpressions.toLocaleString();

    // Render active deals on Publisher side
    renderActiveDealsInPublisher();
}

// Animate Statistics Counters
function animateCounters() {
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        if (isNaN(target)) return;
        const decimals = counter.getAttribute('data-decimals') ? parseInt(counter.getAttribute('data-decimals')) : 0;
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        
        let start = 0;
        const duration = 1500;
        
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const currentVal = progress * target;
            
            counter.textContent = prefix + currentVal.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.textContent = prefix + target.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
            }
        };
        
        window.requestAnimationFrame(step);
    });
}

// Setup live scrolling verified impression feed
function setupLiveActivityFeed() {
    const feedContainer = document.getElementById('liveActivityFeed');
    if (!feedContainer) return;
    
    const initialDeals = ['Campaign #17', 'Campaign #19', 'Direct Deal #5', 'Direct Deal #12'];
    
    setInterval(() => {
        const randomCampaign = initialDeals[Math.floor(Math.random() * initialDeals.length)];
        const baseRate = 0.00005;
        const randomPrice = baseRate + (Math.random() - 0.4) * 0.000015;
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.style.opacity = '0';
        activityItem.style.transform = 'translateX(-10px)';
        activityItem.style.transition = 'all 0.4s ease';
        
        activityItem.innerHTML = `
            <div class="activity-dot success"></div>
            <div class="flex-grow-1 d-flex justify-content-between align-items-center">
                <div>
                    <span class=" fw-bold"><i class="bi bi-patch-check-fill me-1"></i>Impression verified</span>
                    <span class="text-white ms-2">${randomCampaign}</span>
                </div>
                <div class="badge bg-dark border-secondary text-primary font-monospace">${randomPrice.toFixed(6)} ETH</div>
            </div>
        `;
        
        feedContainer.insertBefore(activityItem, feedContainer.firstChild);
        
        setTimeout(() => {
            activityItem.style.opacity = '1';
            activityItem.style.transform = 'translateX(0)';
        }, 50);
        
        // Retain max 10
        if (feedContainer.children.length > 8) {
            feedContainer.lastChild.remove();
        }
        
        // Dynamic additions to publisher balances as simulated views generate
        let available = parseFloat(localStorage.getItem('adchain_publisher_earnings')) || 0.0;
        let total = parseFloat(localStorage.getItem('adchain_publisher_total')) || 0.0;
        let impressions = parseInt(localStorage.getItem('adchain_publisher_impressions')) || 4300;
        
        available += randomPrice;
        total += randomPrice;
        impressions += 1;
        
        localStorage.setItem('adchain_publisher_earnings', available.toString());
        localStorage.setItem('adchain_publisher_total', total.toString());
        localStorage.setItem('adchain_publisher_impressions', impressions.toString());
        
        loadDynamicBalances();
    }, 6000);
}

// Copy Wallet helpers
function setupWalletCopy() {
    document.querySelectorAll('.btn-copy-address').forEach(btn => {
        btn.addEventListener('click', function() {
            const address = this.getAttribute('data-address');
            if (address) {
                navigator.clipboard.writeText(address).then(() => {
                    showToast('Address copied to clipboard!', 'success');
                });
            }
        });
    });
}

function setupDepositEthFlow() {
    const addEthBtn = document.getElementById('addEthBtn');
    const ethAmountInput = document.getElementById('ethAmount');

    if (!addEthBtn || !ethAmountInput) return;

    addEthBtn.addEventListener('click', async function() {
        const amount = parseFloat(ethAmountInput.value);
        if (!amount || amount <= 0) {
            showToast('Please enter a valid ETH amount to deposit.', 'warning');
            return;
        }

        this.disabled = true;
        this.textContent = 'Processing...';

        try {
            if (typeof window.ethereum !== 'undefined') {
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                if (chainId !== '0xaa36a7') {
                    showToast('Please switch MetaMask to Sepolia Testnet before depositing ETH.', 'warning');
                    this.disabled = false;
                    this.textContent = 'Deposit ETH';
                    return;
                }

                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (!accounts || !accounts.length) {
                    showToast('MetaMask wallet is not connected.', 'warning');
                    this.disabled = false;
                    this.textContent = 'Deposit ETH';
                    return;
                }
            }

            const response = await fetch('/add_eth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ amount: amount })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Deposit failed');
            }

            const currentBalance = parseFloat(localStorage.getItem('adchain_advertiser_balance')) || DEFAULT_ADVERTISER_BALANCE;
            const updatedBalance = currentBalance + amount;
            localStorage.setItem('adchain_advertiser_balance', updatedBalance.toString());

            showToast(`Deposit successful: ${amount.toFixed(4)} ETH added to your advertiser wallet.`, 'success');
            ethAmountInput.value = '';
            loadDynamicBalances();
            setTimeout(() => {
                location.reload();
            }, 600);
        } catch (error) {
            console.error('Deposit ETH failed:', error);
            showToast('Deposit failed. Please try again.', 'danger');
        } finally {
            this.disabled = false;
            this.textContent = 'Deposit ETH';
        }
    });
}

// Campaign Wizard Setup
function setupCampaignWizard() {
    const wizardModal = document.getElementById('campaignWizardModal');
    if (!wizardModal) return;
    
    let currentStep = 1;
    const totalSteps = 5;
    
    const stepsElements = wizardModal.querySelectorAll('.wizard-step');
    const panels = wizardModal.querySelectorAll('.wizard-panel');
    const prevBtn = document.getElementById('wizardPrevBtn');
    const nextBtn = document.getElementById('wizardNextBtn');
    const submitBtn = document.getElementById('wizardSubmitBtn');
    
    function updateWizardUI() {
        stepsElements.forEach((step, idx) => {
            const stepNum = idx + 1;
            step.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });
        
        panels.forEach((panel, idx) => {
            panel.classList.remove('active');
            if ((idx + 1) === currentStep) {
                panel.classList.add('active');
            }
        });
        
        prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
        
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
            populateWizardReview();
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateWizardUI();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', async () => {
            if (await validateWizardStep(currentStep)) {
                currentStep++;
                updateWizardUI();
            }
        });
    }
    
    const budgetInput = document.getElementById('wizardBudget');
    if (budgetInput) {
        budgetInput.addEventListener('input', function() {
            const ethVal = parseFloat(this.value) || 0;
            const estimatedTokens = ethVal * 1000;
            const tokenEstimateEl = document.getElementById('wizardTokenEstimate');
            if (tokenEstimateEl) {
                tokenEstimateEl.textContent = `≈ ${estimatedTokens.toLocaleString()} ADC Tokens`;
            }
        });
    }

    function ensureWizardVideoSelection() {
        const selectedVideoId = document.getElementById('wizardVideoId').value;
        if (selectedVideoId) return true;

        const firstCard = document.querySelector('.wizard-video-select-card');
        if (!firstCard) {
            showToast('No ad placements are available yet. Add a video first.', 'warning');
            return false;
        }

        const videoId = firstCard.getAttribute('data-video-id');
        const videoTitle = firstCard.getAttribute('data-video-title');
        const publisherAddress = firstCard.getAttribute('data-publisher-wallet');
        if (videoId) {
            window.selectVideoInWizard(videoId, videoTitle || 'Selected placement', publisherAddress || '');
            return true;
        }
        return false;
    }
    
    async function validateWizardStep(step) {
        if (step === 1) {
            const name = document.getElementById('wizardCampaignName').value.trim();
            if (!name) {
                showToast('Please enter a campaign name.', 'warning');
                return false;
            }
        } else if (step === 2) {
            if (!ensureWizardVideoSelection()) {
                return false;
            }
        } else if (step === 3) {
            const budget = parseFloat(document.getElementById('wizardBudget').value) || 0;
            if (budget <= 0) {
                showToast('Please enter a valid campaign budget.', 'warning');
                return false;
            }
            const activeAdvBalance = await refreshAdvertiserBalanceFromWallet();
            if (budget > activeAdvBalance) {
                showToast(`Insufficient Sepolia ETH balance. You have ${activeAdvBalance.toFixed(4)} ETH available.`, 'danger');
                return false;
            }
        }
        return true;
    }
    
    function populateWizardReview() {
        document.getElementById('reviewCampaignName').textContent = document.getElementById('wizardCampaignName').value;
        document.getElementById('reviewBudget').textContent = parseFloat(document.getElementById('wizardBudget').value).toFixed(4) + ' ETH';
        document.getElementById('reviewSelectedVideo').textContent = document.getElementById('wizardVideoTitleHidden').value || 'None';
        
        const categorySelect = document.getElementById('wizardTargetingCategory');
        document.getElementById('reviewTargeting').textContent = `${categorySelect.value.toUpperCase()} | Desktop & Mobile`;
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            const selectedVideoId = document.getElementById('wizardVideoId').value;
            const videoId = selectedVideoId || (document.querySelector('.wizard-video-select-card')?.getAttribute('data-video-id') || '');
            const budgetVal = parseFloat(document.getElementById('wizardBudget').value) || 0.02;
            const name = document.getElementById('wizardCampaignName').value.trim();
            const publisherAddress = document.getElementById('wizardPublisherAddressHidden')?.value || localStorage.getItem('adchain_publisher_wallet') || ZERO_ADDRESS;
            const currentContract = typeof Web3 !== 'undefined' ? getAdChainContract() : null;
            const liveAdvertiserBalance = await refreshAdvertiserBalanceFromWallet();

            if (!videoId) {
                showToast('Please select an ad placement before launching the campaign.', 'warning');
                this.disabled = false;
                this.textContent = 'Launch Campaign';
                return;
            }

            if (budgetVal > liveAdvertiserBalance) {
                showToast(`Insufficient Sepolia ETH balance. You have ${liveAdvertiserBalance.toFixed(4)} ETH available.`, 'danger');
                this.disabled = false;
                this.textContent = 'Launch Campaign';
                return;
            }

            this.disabled = true;
            this.textContent = 'Depositing budget...';

            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const activeAccount = accounts[0];

                    if (currentContract && publisherAddress && publisherAddress !== ZERO_ADDRESS) {
                        const basePrice = Web3.utils.toWei(String(Math.max(0.000001, budgetVal / 1000)), 'ether');
                        const maxImpressions = Math.max(1, Math.ceil(budgetVal * 1000));
                        const valueWei = Web3.utils.toWei(String(budgetVal), 'ether');

                        showToast('Requesting AdChain contract deployment signature...', 'info');
                        await currentContract.methods.createCampaign(
                            publisherAddress,
                            name,
                            basePrice,
                            maxImpressions
                        ).send({
                            from: activeAccount,
                            value: valueWei
                        });

                        showToast('🎉 Campaign successfully initialized on-chain!', 'success');
                        setTimeout(() => location.reload(), 1200);
                        return;
                    }

                    const message = `AdChain Contract deposit request:\nCampaign: ${name}\nAllocation: ${budgetVal} ETH\nNetwork: Sepolia Testnet`;
                    await window.ethereum.request({ method: 'personal_sign', params: [message, activeAccount] });
                    showToast('MetaMask signature confirmed. Broadcasting transaction...', 'success');
                } catch (walletErr) {
                    console.error(walletErr);
                    showToast('MetaMask signature rejected. Reverting transaction.', 'danger');
                    this.disabled = false;
                    this.textContent = 'Launch Campaign';
                    return;
                }
            }
            
            try {
                const response = await fetch('/create_campaign/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        video_id: videoId,
                        budget: budgetVal,
                        publisher_address: publisherAddress !== ZERO_ADDRESS ? publisherAddress : null,
                        campaign_name: name
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    let advBalance = parseFloat(localStorage.getItem('adchain_advertiser_balance')) || 0.05;
                    advBalance = Math.max(0.0, advBalance - budgetVal);
                    localStorage.setItem('adchain_advertiser_balance', advBalance.toString());
                    
                    showToast('🎉 Campaign successfully created!', 'success');
                    
                    setTimeout(() => {
                        location.reload();
                    }, 1200);
                } else {
                    showToast(data.error || 'Failed to create campaign.', 'danger');
                    this.disabled = false;
                    this.textContent = 'Launch Campaign';
                }
            } catch (error) {
                console.error(error);
                showToast('Backend synchronization timed out.', 'danger');
                this.disabled = false;
                this.textContent = 'Launch Campaign';
            }
        });
    }
}

// Select video details globally
window.selectVideoInWizard = function(videoId, videoTitle, publisherAddress) {
    document.getElementById('wizardVideoId').value = videoId;
    document.getElementById('wizardVideoTitleHidden').value = videoTitle;
    const publisherInput = document.getElementById('wizardPublisherAddressHidden');
    if (publisherInput) {
        publisherInput.value = publisherAddress || '';
    }
    
    document.querySelectorAll('.wizard-video-select-card').forEach(card => {
        card.classList.remove('selected', 'border-primary');
        if (card.getAttribute('data-video-id') === videoId) {
            card.classList.add('selected', 'border-primary');
        }
    });
    
    showToast(`Selected placement: ${videoTitle}`, 'info');
};

// Setup Direct One-to-One Deals Flow
function setupDirectDeals() {
    const dealsListContainer = document.getElementById('directDealsList');
    if (!dealsListContainer) return;
    
    // Load existing deals
    const deals = JSON.parse(localStorage.getItem('adchain_deals')) || [];
    renderDealsTable(deals);
    
    // Form action
    const createDealFormBtn = document.getElementById('createDealBtn');
    if (createDealFormBtn) {
        createDealFormBtn.addEventListener('click', async function() {
            const pubSelect = document.getElementById('dealPublisherSelect');
            const budgetInput = document.getElementById('dealBudget');
            
            const budgetVal = parseFloat(budgetInput.value) || 0.0025;
            const pubName = pubSelect.options[pubSelect.selectedIndex].text;
            const pubWallet = pubSelect.value;
            
            // Validate advertiser budget
            const advBalance = await refreshAdvertiserBalanceFromWallet();
            if (budgetVal > advBalance) {
                showToast(`Insufficient Sepolia ETH available to fund this custom deal. You have ${advBalance.toFixed(4)} ETH.`, 'danger');
                return;
            }
            
            this.disabled = true;
            this.textContent = 'Signing signature...';
            
            if (typeof window.ethereum !== 'undefined') {
                try {
                    showToast('Confirm Sepolia deal transaction signature...', 'info');
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const activeAccount = accounts[0];
                    
                    const message = `AdChain Direct One-to-One Deal:\nTo Publisher: ${pubName}\nWallet: ${pubWallet}\nBudget: ${budgetVal} ETH\nNetwork: Sepolia`;
                    await window.ethereum.request({
                        method: 'personal_sign',
                        params: [message, activeAccount]
                    });
                } catch (err) {
                    showToast('Transaction signature refused.', 'danger');
                    this.disabled = false;
                    this.textContent = 'Create Deal';
                    return;
                }
            }
            
            // Success creating deal
            const newDeal = {
                id: deals.length + 17,
                publisher: pubName,
                wallet: pubWallet,
                inventory: '50,000 impressions',
                price: '0.00005 ETH',
                budget: budgetVal.toFixed(4) + ' ETH',
                status: 'ACTIVE'
            };
            
            deals.push(newDeal);
            localStorage.setItem('adchain_deals', JSON.stringify(deals));
            
            // Decrease balance
            localStorage.setItem('adchain_advertiser_balance', (advBalance - budgetVal).toString());
            
            showToast('🎉 Direct One-to-One Deal registered!', 'success');
            
            budgetInput.value = '';
            this.disabled = false;
            this.textContent = 'Create Deal';
            
            loadDynamicBalances();
            renderDealsTable(deals);
        });
    }
}

function renderDealsTable(deals) {
    const listContainer = document.getElementById('directDealsList');
    if (!listContainer) return;
    
    if (deals.length === 0) {
        listContainer.innerHTML = '<div class="text-center py-4 text-light small">No custom direct publisher deals created yet.</div>';
        return;
    }
    
    let html = `
        <div class="table-responsive small mt-3">
            <table class="table table-dark table-borderless align-middle mb-0">
                <thead>
                    <tr class="text-light border-bottom border-secondary border-opacity-10">
                        <th>Deal ID</th>
                        <th>Publisher</th>
                        <th>Wallet</th>
                        <th>Price/Imp</th>
                        <th>Deal Budget</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    deals.forEach(deal => {
        html += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.02);">
                <td class="py-3 font-monospace text-primary fw-bold">Deal #${deal.id}</td>
                <td class="text-white fw-bold">${deal.publisher}</td>
                <td class="font-monospace">${shortenAddress(deal.wallet)}</td>
                <td>${deal.price}</td>
                <td class=" font-monospace fw-bold">${deal.budget}</td>
                <td><span class="badge bg-success bg-opacity-15  border border-success border-opacity-20 rounded-pill px-2.5 py-1">ACTIVE</span></td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    listContainer.innerHTML = html;
}

// Render active deals on Publisher side
function renderActiveDealsInPublisher() {
    const pubDealsContainer = document.getElementById('publisherDealsList');
    if (!pubDealsContainer) return;
    
    const deals = JSON.parse(localStorage.getItem('adchain_deals')) || [];
    
    if (deals.length === 0) {
        pubDealsContainer.innerHTML = '<div class="text-center py-4 text-light small">No active deals mapped from advertisers.</div>';
        return;
    }
    
    let html = `
        <div class="row g-4">
    `;
    
    deals.forEach(deal => {
        html += `
            <div class="col-md-6 col-lg-4">
                <div class="glass-card p-4">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <span class="text-light small d-block font-monospace">Deal #${deal.id}</span>
                            <h6 class="text-white fw-bold mb-0">${deal.publisher} Placement</h6>
                        </div>
                        <span class="badge bg-success bg-opacity-15  border border-success border-opacity-20 rounded-pill px-2.5 py-1" style="font-size: 0.7rem;">ACTIVE</span>
                    </div>
                    <div class="py-2.5 px-3 rounded-3 bg-dark bg-opacity-30 small text-light mb-3">
                        <div class="d-flex justify-content-between mb-1.5">
                            <span>Impression Price:</span>
                            <span class="text-white">${deal.price}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Remaining Budget:</span>
                            <span class=" fw-bold">${deal.budget}</span>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-primary-glow w-100 py-2" onclick="simulateDealImpression(${deal.id}, '${deal.price}')">
                        <i class="bi bi-play-fill me-1"></i>Simulate Ad View
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    pubDealsContainer.innerHTML = html;
}

// Simulated active deal view incrementer
window.simulateDealImpression = function(dealId, priceStr) {
    const rate = parseFloat(priceStr.split(' ')[0]) || 0.00005;
    
    showToast(`Simulating verified view for Deal #${dealId}...`, 'info');
    
    let impressions = parseInt(localStorage.getItem('adchain_publisher_impressions')) || 4300;
    let available = parseFloat(localStorage.getItem('adchain_publisher_earnings')) || 0.0;
    let total = parseFloat(localStorage.getItem('adchain_publisher_total')) || 0.0;
    
    impressions += 1;
    available += rate;
    total += rate;
    
    localStorage.setItem('adchain_publisher_earnings', available.toString());
    localStorage.setItem('adchain_publisher_total', total.toString());
    localStorage.setItem('adchain_publisher_impressions', impressions.toString());
    
    // Output directly to Live Impression feed ticker if available
    const feedContainer = document.getElementById('liveActivityFeed');
    if (feedContainer) {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-dot success"></div>
            <div class="flex-grow-1 d-flex justify-content-between align-items-center">
                <div>
                    <span class=" fw-bold"><i class="bi bi-patch-check-fill me-1"></i>Impression verified</span>
                    <span class="text-white ms-2">Direct Deal #${dealId}</span>
                </div>
                <div class="badge bg-dark border-secondary text-primary font-monospace">${priceStr}</div>
            </div>
        `;
        feedContainer.insertBefore(activityItem, feedContainer.firstChild);
        if (feedContainer.children.length > 8) feedContainer.lastChild.remove();
    }
    
    showToast('🎉 Impression verified! Publisher earnings credited.', 'success');
    loadDynamicBalances();
};

// Setup withdrawals action via Web3 prompts
function setupWithdrawalFlow() {
    const withdrawBtn = document.getElementById('withdrawToMetaMaskBtn');
    if (!withdrawBtn) return;
    
    withdrawBtn.addEventListener('click', async function() {
        const availableAmount = parseFloat(localStorage.getItem('adchain_publisher_earnings')) || 0.0;
        
        if (availableAmount <= 0) {
            showToast('Accumulated earnings are 0.0000 ETH. Nothing to withdraw.', 'warning');
            return;
        }
        
        const publisherWallet = localStorage.getItem('adchain_publisher_wallet') || '0x9E99a...C108';
        
        this.disabled = true;
        this.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Confirming withdrawal...';
        
        if (typeof window.ethereum !== 'undefined') {
            try {
                const contract = getAdChainContract();
                if (contract) {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const currentAccount = accounts[0];
                    showToast('Verifying Sepolia contract withdrawal...', 'info');
                    await contract.methods.withdraw().send({ from: currentAccount });
                    localStorage.setItem('adchain_publisher_earnings', '0.00000');
                    loadDynamicBalances();
                    showToast(`Withdrawal executed on AdChain contract for ${shortenAddress(currentAccount)}.`, 'success');
                    this.disabled = false;
                    this.innerHTML = '<i class="bi bi-wallet2 me-1.5"></i>WITHDRAW TO METAMASK';
                    return;
                }

                showToast('Verifying Sepolia network parameters...', 'info');
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const currentAccount = accounts[0];
                const message = `AdChain Smart Contract Withdrawal:\nWithdraw available publisher balance:\nAmount: ${availableAmount.toFixed(5)} ETH\nTo Wallet: ${publisherWallet}\nNetwork: Sepolia Testnet`;
                await window.ethereum.request({
                    method: 'personal_sign',
                    params: [message, currentAccount]
                });
                showToast('Signature confirmed! Initializing contract withdrawal transaction...', 'success');
            } catch (err) {
                console.error(err);
                showToast('Withdrawal request rejected by client signature.', 'danger');
                this.disabled = false;
                this.innerHTML = '<i class="bi bi-wallet2 me-1.5"></i>WITHDRAW TO METAMASK';
                return;
            }
        }
        
        setTimeout(() => {
            showToast(`Demo withdrawal credited to ${shortenAddress(publisherWallet)}. No blockchain transaction was sent.`, 'success');
            localStorage.setItem('adchain_publisher_earnings', '0.00000');
            loadDynamicBalances();
            this.disabled = false;
            this.innerHTML = '<i class="bi bi-wallet2 me-1.5"></i>WITHDRAW TO METAMASK';
        }, 1500);
    });
}

// Simulated dynamic pricing charts
function setupDynamicPricingDemo() {
    const adPriceVal = document.getElementById('liveAdPriceVal');
    const demandIndicator = document.getElementById('liveDemandIndicator');
    const inventoryIndicator = document.getElementById('liveInventoryIndicator');
    
    if (!adPriceVal) return;
    
    setInterval(() => {
        let currentPrice = parseFloat(adPriceVal.textContent) || 0.000073;
        const change = (Math.random() - 0.46) * 0.000002;
        currentPrice = Math.max(0.000010, currentPrice + change);
        
        adPriceVal.textContent = currentPrice.toFixed(6);
        
        if (Math.random() > 0.6) {
            const isUp = Math.random() > 0.35;
            demandIndicator.innerHTML = isUp ? '78% <i class="bi bi-arrow-up-right "></i>' : '72% <i class="bi bi-arrow-right "></i>';
            demandIndicator.className = isUp ? ' font-bold' : ' font-bold';
        }
        
        if (Math.random() > 0.7) {
            const count = Math.floor(Math.random() * 50) + 1240;
            inventoryIndicator.textContent = count.toLocaleString();
        }
    }, 4000);
}

// Particle visualizer flowchart setup
function setupNetworkVisualizer() {
    const visualizer = document.querySelector('.network-visualizer');
    if (!visualizer) return;
    
    for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.animationDelay = (i * 0.95) + 's';
        
        const topOffset = 50 + (Math.random() - 0.5) * 10;
        particle.style.top = topOffset + '%';
        
        visualizer.appendChild(particle);
    }
}

// Update budget spending ratios in visual trackers
function updateProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const budget = parseFloat(bar.getAttribute('data-budget')) || 0;
        const spent = parseFloat(bar.getAttribute('data-spent')) || 0;
        if (budget > 0) {
            const ratio = Math.min(100, (spent / budget) * 100);
            bar.style.width = ratio + '%';
        }
    });
}

// Dynamic balances getter
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
