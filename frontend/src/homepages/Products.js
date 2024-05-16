// ProductsPage.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Products = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  return (
    <div className='mt-40'>
      <div className="products">
        <div className="container">
          <h2 className='mb-10' style={{textAlign:'center', fontSize:'30px', fontWeight:'bolder'}}>Our Products</h2>
          <Slider {...settings}>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="card">
                <img src="RiverSand.jpeg" className="card-img-top" alt="" />
                <div className="card-body">
                  <h4 className="card-title">RIVER SAND</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="card">
                <img src="WashedSilica.jpeg" className="card-img-top" alt="" />
                <div className="card-body">
                  <h4 className="card-title">WASHED SILICA SAND</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="card">
                <img src="GravelSand.jpeg" className="card-img-top" alt="" />
                <div className="card-body">
                  <h4 className="card-title">GRAVEL SAND</h4>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default Products;
