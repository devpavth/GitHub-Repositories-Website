document.addEventListener('DOMContentLoaded', function () {

    const loader = document.getElementById('loader');

    function showLoader() {
        loader.style.display = 'block';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }


    // Initial page and total pages
    let currentPage = 1;
    const perPage = 10; // Set the number of repositories per page
    const totalPages = 10; // You need to set the total number of pages

    console.log('currentPage:', currentPage);
    console.log('totalPages:', totalPages);


    // Function to update the pagination based on the current page
    function updatePagination() {
        const pagination = document.getElementById('pagination');

        if (!pagination) {
            console.error("Pagination element not found");
            return;
        }

        const olderButton = document.querySelector('.olderButton');
        const newerButton = document.querySelector('.newerButton');

        // Update the styles of Older and Newer buttons based on the current page
        olderButton.classList.toggle('btn-outline-secondary', currentPage > 1);
        newerButton.classList.toggle('btn-outline-secondary', currentPage < totalPages);

        // Clear existing page numbers
        pagination.innerHTML = '';

        // Add Previous button
        const prevButton = document.createElement('li');
        prevButton.classList.add('page-item');
        prevButton.innerHTML = `
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        `;
        prevButton.addEventListener('click', function () {
            if (currentPage > 1) {
                currentPage--;
                fetchRepositories('johnpapa', 10, currentPage); // Fetch repositories for the previous page
                updatePagination();
            }
        });
        pagination.appendChild(prevButton);

        // Add page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('li');
            pageButton.classList.add('page-item');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageButton.addEventListener('click', function () {
                currentPage = i;
                fetchRepositories('johnpapa', 10, currentPage);
                updatePagination();
            });
            pagination.appendChild(pageButton);
        }

        // Add Next button
        const nextButton = document.createElement('li');
        nextButton.classList.add('page-item');
        nextButton.innerHTML = `
            <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        `;
        nextButton.addEventListener('click', function () {
            if (currentPage < totalPages) {
                currentPage++;
                fetchRepositories('johnpapa', 10, currentPage); // Fetch repositories for the next page
                updatePagination();
            }
        });
        pagination.appendChild(nextButton);

        // Add Older and Newer buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('mt-5', 'mb-3', 'd-flex', 'justify-content-between');

        // Add Older button
        const olderButtonLi = document.createElement('a');
        olderButtonLi.classList.add('btn', 'rounded-pill', 'olderButton', 'mt-3');
        olderButtonLi.href = '#';
        olderButtonLi.innerHTML = '&#x2190; Older';
        olderButtonLi.style.marginRight = '90px';
        olderButtonLi.style.marginLeft = '-415px';

        // Update the class based on the current page
        olderButtonLi.classList.add(currentPage === 1 ? 'btn-outline-secondary' : 'btn-outline-primary');

        olderButtonLi.addEventListener('click', function (event) {
            event.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                fetchRepositories('johnpapa', 10, currentPage);
                updatePagination();
            }
        });

        // Add Newer button
        const newerButtonLi = document.createElement('a');
        newerButtonLi.classList.add('btn', 'rounded-pill', 'newerButton', 'mt-3');
        newerButtonLi.href = '#';
        newerButtonLi.innerHTML = 'Newer &#x2192;';
        newerButtonLi.style.marginLeft = '-10px';

        // Update the class based on the current page
        newerButtonLi.classList.add(currentPage === totalPages ? 'btn-outline-secondary' : 'btn-outline-primary');

        newerButtonLi.addEventListener('click', function (event) {
            event.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                fetchRepositories('johnpapa', 10, currentPage);
                updatePagination();
            }
        });

        buttonsContainer.appendChild(olderButtonLi);
        buttonsContainer.appendChild(newerButtonLi);

        // Append the buttons container to the pagination
        pagination.appendChild(buttonsContainer);

        // Disable/hide Previous button on the first page
        if (currentPage === 1) {
            document.getElementById('prevPage').classList.add('disabled');
        } else {
            document.getElementById('prevPage').classList.remove('disabled');
        }

        // Disable/hide Next button on the last page
        if (currentPage === totalPages) {
            document.getElementById('nextPage').classList.add('disabled');
        } else {
            document.getElementById('nextPage').classList.remove('disabled');
        }
        
    }


    // Fetch GitHub repositories when the page loads
    fetchUserDetails('johnpapa');
    fetchRepositories('johnpapa', 10, 1);

    // Initial page load
    updatePagination();

    
    function fetchUserDetails(username) {
        const token = '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'; //MY_PERSONAL_ACCESS_TOKEN
        fetch(`https://api.github.com/users/${username}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(user => {
                console.log('GitHub User Details:', user);
                // Call a function to render user details
                renderUserDetails(user);
            })
            .catch(error => console.error('Error fetching user details:', error));
    }
    
    // Function to render user details
    function renderUserDetails(user) {
        const userProfile = document.getElementById('userProfile');
        userProfile.innerHTML = `
            <div class="row mt-5">
                <div class="col-md-4">
                    <img src="${user.avatar_url}" alt="Profile Image" class="img-fluid rounded-circle mb-3" id="repo-image">
                    <p class="d-flex"><strong><span class="material-icons">
                    link
                    </span></strong> <a class="link-page ms-2" href="${user.html_url}" target="_blank">${user.html_url}</a></p>
                </div>
            
                <div class="col-md-8 mt-5">
                    <p class="h1"> ${user.name || 'N/A'}</p>
                    <p> ${user.bio || 'N/A'}</p>
                    <p class="d-flex"><strong><span class="material-icons">
                    location_on
                    </span></strong> <span class="ms-2">${user.location || 'N/A'}</span></p>
                    <p><strong>How to reach me: </strong> <a href="https://twitter.com/${user.twitter_username}" target="_blank">https://twitter.com/${user.twitter_username || 'N/A'}</a></p>
                </div>
            </div>
        `;
    }

    document.getElementById('searchButton').addEventListener('click', function () {
        const searchTerm = document.getElementById('searchInput').value;
        fetchRepositories('johnpapa', 10, 1, searchTerm);
    });

    // Function to fetch GitHub repositories
    function fetchRepositories(username, perPage, page, search) {
        const token = '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'; //MY_PERSONAL_ACCESS_TOKEN
        console.log('Token:', token);
        showLoader();
        // Make API call to fetch repositories
        // Update the API URL with the actual GitHub API endpoint for user repositories
        let apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`;

        if (search) {
            apiUrl += `&q=${search}`;
        }

        console.log('API URL:', apiUrl);

        fetch(apiUrl,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('GitHub API Response:', data);
            // Call a function to render repositories in the table
            renderRepositories(data);
            // Call a function to update the pagination based on the current page
            updatePagination();
        })
        .catch(error => console.error('Error fetching repositories:', error))
        .finally(() => hideLoader());
    }

    // Function to render repositories in the table
    function renderRepositories(repositories) {
        const repositoryContainer = document.getElementById('repositoryContainer');
        // Clear existing cards
        repositoryContainer.innerHTML = '';
    
        // Loop through repositories and create cards
        repositories.forEach((repo, index) => {
            // const topicsButtons = repo.topics.map(topic => `<button type="button" class="btn btn-outline-secondary">${topic}</button>`).join(' ');
            // const topicsButtons = Array.isArray(repo.topics) && repo.topics.length > 0
            // ? repo.topics.map(topic => `<button type="button" class="btn btn-info mb-2 me-2">${topic}</button>`).join(' ')
            // : '&nbsp;';

            const maxTopicsToShow = 4;
            const visibleTopics = Array.isArray(repo.topics) ? repo.topics.slice(0, maxTopicsToShow) : [];
            const hiddenTopicsCount = Array.isArray(repo.topics) ? Math.max(0, repo.topics.length - maxTopicsToShow) : 0;

            let topicsButtons = '';

            if (visibleTopics.length > 0) {
                topicsButtons = visibleTopics.map(topic => `<button type="button" class="btn btn-info me-2">${topic}</button>`).join(' ');

                // Add a button for hidden topics, if any
                if (hiddenTopicsCount > 0) {
                    const lastButtonIndex = Math.min(maxTopicsToShow - 1, visibleTopics.length - 1);
                    const lastButton = `<button type="button" class="btn btn-info me-2">${visibleTopics[lastButtonIndex]} ${hiddenTopicsCount}+</button>`;
                    topicsButtons = topicsButtons.split('</button>').slice(0, lastButtonIndex).join('</button>') + lastButton;
                }
            } else {
                // If there are no topics, add a non-breaking space
                topicsButtons = '&nbsp;';
            }

            const card = `
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body d-flex flex-column">
                            <h3 class="card-title text-primary">${repo.name}</h3>
                            <p class="card-text truncate-description">${repo.description || 'No description available'}</p>
                            <p class="card-text">${repo.language ? `<strong>Language:</strong> ${repo.language}` : '&nbsp;'}</p>
                            
                            <p class="card-text"> ${topicsButtons}</p>
                            <div class="mt-auto">
                                <a href="${repo.html_url}" class="btn btn-primary" target="_blank">View on GitHub</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            repositoryContainer.innerHTML += card;
        });
    }
    
});