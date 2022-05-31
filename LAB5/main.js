// constants
const productPath = 'product.json';
const imgDir = 'img';

const keyword = document.getElementById('keyword');
const category = document.getElementById('category');
const search_button = document.getElementById('search-button');
const search_result = document.getElementById('search-result');

const display_step = 2;

// global variables
let display_start = 0;
let display_end = 4;
let result;

// parsing json file
fetch(productPath)
    .then(response => response.json())
    .then(jsonFile => parseJson(jsonFile));

function parseJson(jsonFile)
{
    let cur_category = category.value;
    let cur_keyword = '';
    let category_result = [];
    result = jsonFile;

    show(result);

    search_button.onclick = showResult;
    function showResult(e)
    {
        e.preventDefault();
        category_result = [];
        result = [];
        display_start = 0;
        display_end = 4;

        // search products by category
        cur_category = category.value;

        if (cur_category == '전체')
            category_result = jsonFile;
        else
        {
            for (let item of jsonFile)
            {
                if (item.type == cur_category) 
                    category_result.push(item);
            }
        }

        // search products by keyword
        cur_keyword = keyword.value.replace(/\s/g, '');

        if (cur_keyword.trim() === '')
            result = category_result;
        else
        {
            for (let item of category_result)
            {
                if (item.name.replace(/\s/g, '').includes(cur_keyword))
                    result.push(item);
            }
        }

        // print result
        show(result);
    }
}

// infinite scroll
window.addEventListener('scroll', infiniteScroll);
function infiniteScroll()
{    
    const scrollHeight = document.body.scrollHeight;
    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    
    if (scrollHeight <= scrollY + innerHeight)
    {
        if (display_start < result.length)
        {
            addItem(result);
            display_start = display_end;
            display_end += display_step;
        }
    }
}

// functions for displaying products in the list
function show(items)
{
    // clear prev result
    while (search_result.firstChild != null)
        search_result.removeChild(search_result.firstChild);

    // if no items to display
    if (items.length == 0)
    {
        let noResultMsg = document.createElement('p');
        noResultMsg.textContent = 'No Search Results';
        search_result.appendChild(noResultMsg);
    }
    
    // display items
    else
    {
        let items_display = document.createElement('div');
        items_display.setAttribute('class', 'items-display');
        search_result.appendChild(items_display);

        addItem(items);

        display_start = display_end;
        display_end += display_step;
    }
}

function addItem(items)
{
    for (let i=display_start; i<Math.min(items.length, display_end); i++)
    {
        let item = items[i];
        let items_display = document.getElementsByClassName('items-display')[0];

        let single_item = document.createElement('div');
        single_item.setAttribute('class', 'single-item');

        let img_box = document.createElement('div');
        img_box.setAttribute('class', 'image-box');

        let img = document.createElement('img');
        img.src = `${imgDir}/${item.img}`;
        img.alt = `${item.name} ${item.ml}mL`;
        img.style.zIndex = '3';
        img.setAttribute('id', `img-${i}`)
        img.onclick = function(e)
        {
            e.preventDefault();
            // change z-index to show/hide addtional info
            let clickedImg = document.getElementById(this.id);

            if (clickedImg.style.zIndex == '3')
                clickedImg.style.zIndex = '1';
            else
                clickedImg.style.zIndex = '3';
        }

        let item_name = document.createElement('p');
        item_name.setAttribute('class', 'item-name');
        item_name.textContent = item.name;

        let item_price = document.createElement('div');
        item_price.setAttribute('class', 'item-price');
        item_price.textContent = `${item.price} 원`;
        item_price.style.zIndex = '2';

        let item_ml = document.createElement('div');
        item_ml.setAttribute('class', 'item-ml');
        item_ml.textContent = `${item.ml} mL`;
        item_ml.style.zIndex = '2';

        img_box.appendChild(img);
        img_box.appendChild(item_price);
        img_box.appendChild(item_ml);
        single_item.appendChild(img_box);
        single_item.appendChild(item_name);
        items_display.appendChild(single_item);
    }
}