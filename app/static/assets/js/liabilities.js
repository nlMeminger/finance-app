function sendApiRequest(url, data) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    // Return the fetch promise
    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Return the parsed JSON data
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
            // Optionally re-throw the error to propagate it to the caller
            throw error;
        });
}
document.addEventListener("DOMContentLoaded", () => {
    data={
        user_id: userData
    }
    url = '/get_credit_utilization'
    
    sendApiRequest(url, data)
    .then(data => {
      document.getElementById('credit-utilization-text').textContent = Math.round((data['utilization'] * 100))+'%';
    })
    .catch(error => {
      console.error('Error fetching outflow data:', error);
    });
});