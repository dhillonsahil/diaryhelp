import React from 'react'

const Features = () => {
  return (
    <div id="features">
      <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
      <div className="md:w-2/3 lg:w-1/2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-secondary">
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
      </svg>
      
      <h2 className="my-8 text-2xl font-bold text-gray-700  md:text-4xl">
        A technology-first approach to Calculations
        and Management
      </h2>
      <p className="text-gray-600 ">Milk Manage is a website that helps you manage your dairy business with ease. Whether you are a milk producer, seller, or consumer, you can use our website to keep track of your transactions, expenses, and profits.

</p>
    </div>
    <div
      className="mt-16 grid divide-x divide-y divide-gray-100  overflow-hidden rounded-3xl border border-gray-100 text-gray-600  sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 xl:grid-cols-4"
    >
      <div className="group relative bg-white  transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
        <div className="relative space-y-8 py-12 p-8">
          <img
            src="./tag.png"
            className="w-12"
            width="512"
            height="512"
            alt="Milk Manage Milk Management"
          />

          <div className="space-y-2">
            <h5
              className="text-xl font-semibold text-gray-700  transition group-hover:text-secondary"
            >
              First feature
            </h5>
            <p className="text-gray-600 ">
              Set or update the daily prices of milk based on the market trends and demand. You can also compare the prices of different suppliers and buyers.
            </p>
          </div>
        </div>
      </div>
      <div className="group relative bg-white  transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
        <div className="relative space-y-8 py-12 p-8">
          <img
            src="./buy.png"
            className="w-12"
            width="512"
            height="512"
            alt="Milk Manage Milk Management"
          />

          <div className="space-y-2">
            <h5
              className="text-xl font-semibold text-gray-700 transition group-hover:text-secondary"
            >
              Second feature
            </h5>
            <p className="text-gray-600 ">
Buy or sell milk and update your consumption records. You can also view your daily, weekly, or monthly milk usage and sales reports.
            </p>
          </div>
          
        </div>
      </div>
      <div className="group relative bg-white  transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
        <div className="relative space-y-8 py-12 p-8">
          <img
            src="./pdf.png"
            className="w-12"
            width="512"
            height="512"
            alt="Milk Manage Milk Management"
          />

          <div className="space-y-2">
            <h5
              className="text-xl font-semibold text-gray-700  transition group-hover:text-secondary"
            >
              Third feature
            </h5>
            <p className="text-gray-600 ">
              Check your sales, purchase, and overall bill and get a PDF copy of your invoices and receipts. You can also view your income statement and balance sheet.
            </p>
          </div>
         
        </div>
      </div>
      <div
        className="group relative bg-gray-50  transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10"
      >
        <div
          className="relative space-y-8 py-12 p-8 transition duration-300 group-hover:bg-white "
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4341/4341025.png"
            className="w-12"
            width="512"
            height="512"
            alt="burger illustration"
          />

          <div className="space-y-2">
            <h5
              className="text-xl font-semibold text-gray-700  transition group-hover:text-secondary"
            >
              More features
            </h5>
            <p className="text-gray-600 ">
              There are many more features that you can see when you are in dashboard. We can add more features accordingly to your need.
            </p>
          </div>
          
        </div>
      </div>
    </div>

</div>
    </div>
  )
}

export default Features
