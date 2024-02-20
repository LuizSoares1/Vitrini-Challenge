const fetchResults = async () => {
    const res = await fetch("https://desafio.xlow.com.br/search")
    return res.json()
}

const fetchProductID = async (productId) => {
    const res = await fetch(`https://desafio.xlow.com.br/search/${productId}`)
    return res.json()
}

/* ------------------------------------------------------------------------------------ */

const fetchesResultsProducts = async () => {
    const resultContainer = document.querySelector(".vitrini")
    
    const results = await fetchResults()

    results.forEach(async (e) => {
        const productId = e.productId
        const product = await fetchProductID(productId)
        const items = product.items
        const urlItems = items[0].images[0].imageUrl
        const textProductName = product.productName
        const listPrice = e.listPrice
        const bestPrice = e.bestPrice
        
        resultContainer.appendChild(showProduct(productId, items, urlItems, textProductName, listPrice, bestPrice))
    })
}

/* ------------------------------------------------------------------------------------ */

const showProduct = (productId, items, urlItems, textProductName, listPrice, bestPrice) => {
    
    /* Criando elemento do produto */
    const product = document.createElement("div")
    product.id = productId
    product.classList.add ("products","productsWidth")

    /* Criando elemento da imagem principal */
    const mainImage = document.createElement("div")
    mainImage.classList.add("mainImageContainer")

    const image = document.createElement("img")
    image.classList.add("mainImage")
    image.src = urlItems
    image.alt = textProductName
    image.setAttribute("draggable", "false")

    mainImage.appendChild(image)
    product.appendChild(mainImage)

    /* Criando seletores de imagem */

    const imageItems = document.createElement("div")
    imageItems.classList.add("imageItemsGroup")

    if (Array.isArray(items)) {
        items.forEach(e => {
            const imageItem = document.createElement("img")
            imageItem.classList.add("imageItems")
            imageItem.src = e.images[0].imageUrl
            imageItem.alt = e.images[0].imageText
            imageItem.addEventListener("click", () =>
                selectItem(productId, imageItem.src)
            )
            imageItems.appendChild(imageItem)
            imageItem.setAttribute("draggable", "false")
        })
    }

    product.appendChild(imageItems)

    /*Criando Nome dos produtos */

    const productNameMain = document.createElement("div")
    productNameMain.classList.add("productNameMain")

    const productName = document.createElement("p")
    productName.classList.add("productName")
    productName.textContent = `${textProductName}`

    productNameMain.appendChild(productName)
    product.appendChild(productNameMain)

    /*Criando Elementos de Preços */

    const prices = document.createElement("div")
    prices.classList.add("priceOnly")

    const listPriceContainer = document.createElement("div")
    listPriceContainer.classList.add("listPriceContainer")

    if (listPrice !== bestPrice) {
        const listPriceElement = document.createElement("p")
        listPriceElement.textContent = `$${formatPrice(listPrice)}`
        listPriceElement.classList.add("listPrice","voidPrice")
        listPriceContainer.appendChild(listPriceElement)
    }

    prices.appendChild(listPriceContainer)

    const priceDiscountContainer = document.createElement("div")
    priceDiscountContainer.classList.add("priceDiscountContainer")
    
    const discoutedPrice = document.createElement("div")
    discoutedPrice.textContent = `$${formatPrice(bestPrice)}`
    discoutedPrice.classList.add("discountedPrice")

    priceDiscountContainer.appendChild(discoutedPrice)
    prices.appendChild(priceDiscountContainer)
    product.appendChild(prices)

    const btnBuy = document.createElement("button")
    btnBuy.textContent = "BUY"
    btnBuy.classList.add("btnBuy")
    product.appendChild(btnBuy)
    
    return product
}

const formatPrice = (price) => {
    const formattedPrice = price.toString().padStart(3, "0")
    return `${formattedPrice.slice(0, -2)},${formattedPrice.slice(-2)}`
}

const selectItem = (productId, urlItems) => {
    const product = document.getElementById(productId)
    const mainImage = product.querySelector(".mainImage")
    mainImage.src = urlItems
}

/* ------------------------------------------------------------------------------------ */

const toggleColumns = () => {
    const container = document.querySelector(".vitrini")
    const isMobile = window.innerWidth < 1024

    if (isMobile) {
        container.style.gridTemplateColumns = `repeat(${isGridView ? 1 : 2}, 1fr)`
    }else {
        container.style.gridTemplateColumns = `repeat(${isGridView ? 5 : 4}, 1fr)`
    }

    document.querySelectorAll(".products").forEach((element) => element.classList.toggle("productsMobile"))
}

const handleResize = () => {
    toggleColumns()
}

document.getElementById("buttonChangeCol").addEventListener("click", () => {
    isGridView = !isGridView
    toggleColumns()
})

let isGridView = true

console.log(toggleColumns)

window.addEventListener("resize", handleResize)
 
fetchesResultsProducts()