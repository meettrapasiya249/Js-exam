
        let users = JSON.parse(localStorage.getItem('expenseTrackerUsers')) || [];
        let currentUser = null;
        let expenses = JSON.parse(localStorage.getItem('expenseTrackerExpenses')) || {};
        
        let signupView = document.getElementById('signupView');
        let loginView = document.getElementById('loginView');
        let dashboardView = document.getElementById('dashboardView');
        let showLogin = document.getElementById('showLogin');
        let showSignup = document.getElementById('showSignup');
        let signupForm = document.getElementById('signupForm');
        let loginForm = document.getElementById('loginForm');
        let expenseForm = document.getElementById('expenseForm');
        let expensesList = document.getElementById('expensesList');
        let searchBtn = document.getElementById('searchBtn');
        let expenseIdSearch = document.getElementById('expenseIdSearch');
        let searchResults = document.getElementById('searchResults');
        let logoutBtn = document.getElementById('logoutBtn');
        
        showLogin.addEventListener('click', () => {
            signupView.classList.remove('active');
            loginView.classList.add('active');
        });
        
        showSignup.addEventListener('click', () => {
            loginView.classList.remove('active');
            signupView.classList.add('active');
        });
        
        signupForm.addEventListener('submit', handleSignup);
        loginForm.addEventListener('submit', handleLogin);
        expenseForm.addEventListener('submit', addExpense);
        searchBtn.addEventListener('click', searchExpense);
        logoutBtn.addEventListener('click', logout);
        
        checkLoggedIn();
        
        function checkLoggedIn() {
            let loggedInUser = localStorage.getItem('expenseTrackerCurrentUser');
            if (loggedInUser) {
                currentUser = JSON.parse(loggedInUser);
                showDashboard();
                loadExpenses();
            }
        }
        
        function handleSignup(e) {
            e.preventDefault();
            
            let email = document.getElementById('email').value;
            let password = document.getElementById('password').value;
            let confirmPassword = document.getElementById('confirmPassword').value;
            
            if (!validateEmail(email)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address';
                return;
            } else {
                document.getElementById('emailError').textContent = '';
            }
            
            if (users.some(user => user.email === email)) {
                document.getElementById('emailError').textContent = 'Email already exists';
                return;
            }
            
            if (password.length < 6) {
                document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
                return;
            } else {
                document.getElementById('passwordError').textContent = '';
            }
            
            if (password !== confirmPassword) {
                document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
                return;
            } else {
                document.getElementById('confirmPasswordError').textContent = '';
            }
            
            let newUser = {
                id: Date.now().toString(),
                email,
                password 
            };
            
            users.push(newUser);
            localStorage.setItem('expenseTrackerUsers', JSON.stringify(users));
            
            if (!expenses[newUser.id]) {
                expenses[newUser.id] = [];
                localStorage.setItem('expenseTrackerExpenses', JSON.stringify(expenses));
            }
            
            alert('Account created successfully! Please login.');
            signupForm.reset();
            signupView.classList.remove('active');
            loginView.classList.add('active');
        }
        
        function handleLogin(e) {
            e.preventDefault();
            
            let email = document.getElementById('loginEmail').value;
            let password = document.getElementById('loginPassword').value;
            
            let user = users.find(user => user.email === email && user.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('expenseTrackerCurrentUser', JSON.stringify(currentUser));
                showDashboard();
                loadExpenses();
                loginForm.reset();
            } else {
                document.getElementById('loginPasswordError').textContent = 'Invalid email or password';
            }
        }
        
        function showDashboard() {
            signupView.classList.remove('active');
            loginView.classList.remove('active');
            dashboardView.classList.add('active');
        }
        
        function loadExpenses() {
            if (!currentUser) return;
            
            let userExpenses = expenses[currentUser.id] || [];
            expensesList.innerHTML = '';
            
            if (userExpenses.length === 0) {
                expensesList.innerHTML = '<tr><td colspan="5">No expenses found</td></tr>';
                return;
            }
            
            userExpenses.forEach(expense => {
                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>${expense.id}</td>
                    <td>${expense.name}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td>${expense.date}</td>
                `;
                expensesList.appendChild(row);
            });
        }
        
        function addExpense(e) {
            e.preventDefault();
            
            if (!currentUser) return;
            
            let name = document.getElementById('expenseName').value;
            let amount = parseFloat(document.getElementById('expenseAmount').value);
            let date = document.getElementById('expenseDate').value;
            
            let newExpense = {
                id: Date.now().toString(),
                name,
                amount,
                date,
            };
            
            if (!expenses[currentUser.id]) {
                expenses[currentUser.id] = [];
            }
            
            expenses[currentUser.id].push(newExpense);
            localStorage.setItem('expenseTrackerExpenses', JSON.stringify(expenses));
            
            expenseForm.reset();
            loadExpenses();
        }
        
        function searchExpense() {
            if (!currentUser) return;
            
            let expenseId = expenseIdSearch.value.trim();
            if (!expenseId) {
                searchResults.innerHTML = '<p>Please enter an expense ID</p>';
                return;
            }
            
            let userExpenses = expenses[currentUser.id] || [];
            let foundExpense = userExpenses.find(exp => exp.id === expenseId);
            
            if (foundExpense) {
                searchResults.innerHTML = `
                    <div class="expense-details">
                        <h4>Expense Details</h4>
                        <p><strong>ID:</strong> ${foundExpense.id}</p>
                        <p><strong>Name:</strong> ${foundExpense.name}</p>
                        <p><strong>Amount:</strong> $${foundExpense.amount.toFixed(2)}</p>
                        <p><strong>Date:</strong> ${foundExpense.date}</p>
                    </div>
                `;
            } else {
                searchResults.innerHTML = '<p>No expense found with that ID</p>';
            }
        }
        
        function logout() {
            currentUser = null;
            localStorage.removeItem('expenseTrackerCurrentUser');
            dashboardView.classList.remove('active');
            loginView.classList.add('active');
        }
        
        function validateEmail(email) {
            let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }