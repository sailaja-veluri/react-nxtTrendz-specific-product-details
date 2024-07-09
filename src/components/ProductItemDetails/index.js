// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsData: {},
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
    similarProductsData: [],
  }

  componentDidMount() {
    this.getProducts()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prev => ({
        quantity: prev.quantity - 1,
      }))
    }
  }

  onIncrement = () => {
    this.setState(prev => ({
      quantity: prev.quantity + 1,
    }))
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <>
      <div className="products-error-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="products-failure-img"
        />
        <h1 className="product-failure-heading-text">Product Not Found</h1>
        <button
          className="continue-shopping-button"
          onClick={this.onClickContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    </>
  )

  renderProductDetailsView = () => {
    const {productData, similarProductsData, quantity} = this.state
    const {
      title,
      brand,
      imageUrl,
      rating,
      price,
      totalReviews,
      availability,
      description,
    } = productData
    return (
      <div className="products-container">
        <div className="products-details-container">
          <img src={imageUrl} className="product-image" alt="product" />
          <div className="product-Description-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">RS {price}</p>
            <div className="rating-reviews-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="availability-brand-container">
              <h2 className="availability-brand-heading">Available:</h2>
              <p className="availability-brand-info">{availability}</p>
            </div>
            <div className="availability-brand-container">
              <h2 className="availability-brand-heading">Brand:</h2>
              <p className="availability-brand-info">{brand}</p>
            </div>
            <hr className="horizontal-line" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-controller-button"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare
                  className="quantity-controller-icon"
                  aria-label="close"
                />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-controller-button"
                onClick={this.onIncrement}
                data-testid="plus"
              >
                <BsPlusSquare
                  className="quantity-controller-icon"
                  aria-label="close"
                />
              </button>
            </div>
            <button type="button" className="button add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similarProducts-container">
          <h3 className="similarProducts-heading">Similar Products</h3>
          <ul className="similarProducts-list">
            {similarProductsData.map(product => (
              <SimilarProductItem productData={product} key={product.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-details-section">
        <Header />
        {this.renderAllProducts()}
      </div>
    )
  }
}

export default ProductItemDetails
