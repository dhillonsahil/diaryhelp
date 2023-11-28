import React from 'react'


const TotalCustomers = (props) => {
  return (
<div className="max-w-full mx-4 py-6 sm:mx-auto sm:px-6 lg:px-8">
    <div className="sm:flex sm:space-x-4">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/4 sm:my-8">
            <div className="bg-white p-5">
                <div className="sm:flex sm:items-start">
                    <div className="text-center sm:mt-0 sm:ml-2 sm:text-left">
                        <h3 className="text-sm leading-6 font-medium text-gray-400">Total Customers</h3>
                        <p className="text-3xl font-bold text-black">{props.totalCust ?props.totalCust :0}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/4 sm:my-8">
            <div className="bg-white p-5">
                <div className="sm:flex sm:items-start">
                    <div className="text-center sm:mt-0 sm:ml-2 sm:text-left">
                        <h3 className="text-sm leading-6 font-medium text-gray-400">Fat Rate</h3>
                        <p className="text-3xl font-bold text-black">{props.fatRate}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/4 sm:my-8">
            <div className="bg-white p-5">
                <div className="sm:flex sm:items-start">
                    <div className="text-center sm:mt-0 sm:ml-2 sm:text-left">
                        <h3 className="text-sm leading-6 font-medium text-gray-400">Snf rate</h3>
                        <p className="text-3xl font-bold text-black">{props.snfRate}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/4 sm:my-8">
            <div className="bg-white p-5">
                <div className="sm:flex sm:items-start">
                    <div className="text-center sm:mt-0 sm:ml-2 sm:text-left">
                        <h3 className="text-sm leading-6 font-medium text-gray-400">Regular Price</h3>
                        <p className="text-3xl font-bold text-black">{props.regularPrice}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default TotalCustomers
