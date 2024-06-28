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
    errorMsg: '',
  }

  componentDidMount() {
    this.getProducts()
  }

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
    const fetchedData = await response.json()
    if (response.ok) {
      const updatedData = {
        title: fetchedData.title,
        brand: fetchedData.brand,
        price: fetchedData.price,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        rating: fetchedData.rating,
        similarProducts: fetchedData.similar_products,
        availability: fetchedData.availability,
        totalReviews: fetchedData.total_reviews,
        description: fetchedData.description,
      }
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        errorMsg: fetchedData.error_msg,
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onDecrement = () => {
    this.setState(prev => ({
      quantity: prev.quantity - 1,
    }))
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

  renderFailureView = () => {
    const {errorMsg} = this.state

    return (
      <>
        <div className="products-error-view-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
            alt="error view"
            className="products-failure-img"
          />
          <h1 className="product-failure-heading-text">{errorMsg}</h1>
          <button
            className="continue-shopping-button"
            onClick={this.onClickContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </>
    )
  }

  renderProductDetailsView = () => {
    const {productData, quantity} = this.state
    const {
      title,
      brand,
      imageUrl,
      rating,
      price,
      totalReviews,
      availability,
      similarProducts,
      description,
    } = productData
    return (
      <div className="products-container">
        <div className="products-details-container">
          <img src={imageUrl} className="product-image" alt="product" />
          <div className="product-Description-container">
            <h1 className="product-title">{title}</h1>
            <h1 className="product-price">RS {price}</h1>
            <div className="rating-reviews-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
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
            <hr className="hr-line" />
            <div className="quantity-container">
              <BsDashSquare onClick={this.onDecrement} />
              <p className="quantity">{quantity}</p>
              <BsPlusSquare onClick={this.onIncrement} />
            </div>
          </div>
        </div>
        <div className="similarProducts-container">
          <h3 className="similarProducts-heading">Similar Products</h3>
          <ul className="similarProducts-list">
            {similarProducts.map(product => (
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
