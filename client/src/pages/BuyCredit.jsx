import React from 'react'
import { assets, plans } from '../assets/assets'

const BuyCredit = () => {
  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-white text-center pt-16 mb-16 px-4">
      
      {/* Badge */}
      <button className="border border-gray-300 px-10 py-2 rounded-full mb-6 text-sm tracking-wide hover:bg-gray-100 transition">
        Our Plans
      </button>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-400 bg-clip-text text-transparent mb-12">
        Choose the plan that’s right for you
      </h1>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {plans.map((item, index) => (
          <div
            key={index}
            className="group relative bg-white border rounded-2xl px-8 py-12 w-[280px]
                       shadow-md hover:shadow-2xl hover:-translate-y-2
                       transition-all duration-500"
          >

            {/* Icon */}
            <div className="w-12 h-12 mx-auto flex items-center justify-center 
                            rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
              <img width={26} src={assets.logo_icon} alt="logo" />
            </div>

            {/* Plan Name */}
            <p className="mt-5 text-lg font-semibold text-gray-900">
              {item.id}
            </p>

            {/* Description */}
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              {item.desc}
            </p>

            {/* Price */}
            <p className="mt-6 text-gray-800">
              <span className="text-4xl font-bold">${item.price}</span>
              <span className="text-sm text-gray-500"> / {item.credits} credits</span>
            </p>

            {/* Button */}
            <button
              className="w-full mt-8 py-3 rounded-lg text-sm font-medium
                         bg-gradient-to-r from-gray-900 to-gray-700
                         text-white hover:opacity-90 transition"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuyCredit
