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
  const apiUrl = '/transactions_by_category';
  const data = {
    userid: userData
  };

  // Use .then() to handle the Promise
  sendApiRequest(apiUrl, data)
    .then(responsedata => {
      let keys = [];
      let values = [];

      for (let i = 0; i < responsedata.length; i++) {
        keys.push(responsedata[i]['sum']);
        values.push(responsedata[i]['description']);
      }

      new ApexCharts(document.querySelector("#pieChart"), {
        series: keys,
        chart: {
          height: 350,
          type: 'pie',
          toolbar: {
            show: true
          }
        },
        labels: values
      }).render();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

    let USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
  });

  // Use .then() to set the content of 'outflow-card' after the API call is complete
  sendApiRequest('/outflow/get', { userid: userData, days_ago: 30 })
    .then(data => {
      document.getElementById('outflow-card').textContent = USDollar.format(data['sum']);
    })
    .catch(error => {
      console.error('Error fetching outflow data:', error);
    });



    //inflow
    sendApiRequest('/inflow/get', { userid: userData, days_ago: 30 })
    .then(data => {
      document.getElementById('inflow-card').textContent = USDollar.format(data['sum']);
    })
    .catch(error => {
      console.error('Error fetching outflow data:', error);
    });


    //networth
    sendApiRequest('/networth/get', { userid: userData})
    .then(data => {
      document.getElementById('networth-card').textContent = USDollar.format(data['sum']);
    })
    .catch(error => {
      console.error('Error fetching outflow data:', error);
    });



    //recent transactions
    sendApiRequest('/recent_transactions/get', { userid: userData})
    .then(data => {
      var table = document.getElementById('recent-transactions-card');
      var tbody = table.querySelector('tbody');
      data.forEach(function (transaction) {
        var row = tbody.insertRow();
        row.insertCell(0).textContent = transaction.merchant_name;
        row.insertCell(1).textContent =  USDollar.format(transaction.amount);
        row.insertCell(2).textContent = transaction.category;
        row.insertCell(3).textContent = transaction.pending;
        row.insertCell(4).textContent = transaction.date;
    });
    })
    .catch(error => {
      console.error('Error fetching outflow data:', error);
    });

});
