var accountLink = ''
var editing = false
var originalText = ''


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


document.getElementById('account-table').addEventListener('dblclick', function (event) {
    var target = event.target;
    var cell = target.closest('td');
    if (cell && !cell.classList.contains('action-column')) {
        var columnIndex = cell.cellIndex;
        if (target.tagName != 'INPUT' && columnIndex === 0) {
            accountLink = cell.children.item(0).getAttribute('href')
            var cellData = cell.textContent;
            originalText = cellData
            const input = document.createElement('input')
            const input_type = document.createAttribute("type")
            const input_id = document.createAttribute("id")
            const input_class = document.createAttribute("class")
            const input_value = document.createAttribute("value")
            input_type.value = "text"
            input_id.value = "account-name"
            input_class.value = "form-control"
            input_value.value = cellData
            input.setAttributeNode(input_class)
            input.setAttributeNode(input_id)
            input.setAttributeNode(input_type)
            input.setAttributeNode(input_value)
            cell.replaceChild(input, cell.childNodes[0])
            input.focus()
            input.setSelectionRange(input.value.length, input.value.length)
        }else if (columnIndex === 6){
            var cellData = cell.textContent.split('$')[1]
            originalText = cellData
            const money = document.createTextNode('$')
            const input = document.createElement('input')
            const input_type = document.createAttribute("type")
            const input_id = document.createAttribute("id")
            const input_class = document.createAttribute("class")
            const input_value = document.createAttribute("value")
            input_type.value = "text"
            input_id.value = "account-limit"
            input_class.value = "form-control"
            input_value.value = cellData
            input.setAttributeNode(input_class)
            input.setAttributeNode(input_id)
            input.setAttributeNode(input_type)
            input.setAttributeNode(input_value)
            cell.replaceChild(money, cell.childNodes[0])
            cell.appendChild(input)
            input.focus()
            input.setSelectionRange(input.value.length, input.value.length)
        } else if (columnIndex === 7){
            var cellData = cell.textContent.split('%')[1]
            originalText = cellData
            const percent = document.createTextNode('%')
            const input = document.createElement('input')
            const input_type = document.createAttribute("type")
            const input_id = document.createAttribute("id")
            const input_class = document.createAttribute("class")
            const input_value = document.createAttribute("value")
            input_type.value = "text"
            input_id.value = "account-interest-rate"
            input_class.value = "form-control"
            input_value.value = cellData
            input.setAttributeNode(input_class)
            input.setAttributeNode(input_id)
            input.setAttributeNode(input_type)
            input.setAttributeNode(input_value)
            cell.replaceChild(input, cell.childNodes[0])
            cell.appendChild(percent)
            input.focus()
            input.setSelectionRange(input.value.length, input.value.length)
        } 
    }
});

document.getElementById('account-table').addEventListener('blur', function (event) {
    var target = event.target;
    if (target.tagName === 'INPUT' && !editing) {
        var cellData = target.value;
        if (cellData === ''){
            cellData = originalText
        }
        save_data(target)
            
            //sendApiRequest('/update_account_name', data)
    }
}, true);

document.getElementById('account-table').addEventListener('keypress', function (event) {
    var key = event.key;
    var target = event.target;
    if (key == "Enter") {
        if (target.tagName === 'INPUT') {
            editing = true;
            save_data(target)
        }
    }
    editing = false
}, true);






function save_data(target) {
    var cell = target.closest('td');
    var cellData = target.value;
    switch (target.id) {
        case 'account-name':
            const link = document.createElement('a')
            link.textContent = cellData
            const href = document.createAttribute("href");
            href.value = accountLink
            link.setAttributeNode(href)
            cell.replaceChild(link, cell.childNodes[0])
            account_id = accountLink.split('/')[2]
            data = {
                account_id: account_id,
                user_id: userData,
                account_name: cellData
            }
            url = '/update_account_name'
            break;
        case 'account-limit':
            text = document.createTextNode('$' + cellData)
            cell.removeChild(cell.childNodes[0])
            cell.replaceChild(text, cell.childNodes[0])
            account_id = cell.parentNode.cells[0].childNodes[0].href.split('account/')[1].slice(0,-1)
            account_limit = cellData
            data = {
                account_id: account_id,
                user_id: userData,
                account_limit: account_limit
            }
            url = '/update_account_limit'
            break;
        case 'account-interest-rate':
            text = document.createTextNode(cellData+'%')
            cell.removeChild(cell.childNodes[0])
            cell.replaceChild(text, cell.childNodes[0])
            account_id = cell.parentNode.cells[0].childNodes[0].href.split('account/')[1].slice(0,-1)
            interest_rate = cellData
            data = {
                account_id: account_id,
                user_id: userData,
                interest_rate: interest_rate
            }
            url = '/update_account_interest_rate'
            break;
    }

    sendApiRequest(url, data)

}





