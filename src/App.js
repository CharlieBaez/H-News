import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function App() {
	const [results, setResults] = useState([]);
	const [query, setQuery] = useState('');
	const [input, setInput] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [home, setHome] = useState(true);

	const searchInputRef = useRef();

	useEffect(() => {
		fetchData();
	}, []);

	const checkHome = () => {
		if (home) {
			return `https://hn.algolia.com/api/v1/search?tags=front_page`;
		} else {
			return `https://hn.algolia.com/api/v1/search?query=${query}`;
		}
	};

	const fetchData = async () => {
		setLoading(true);
		try {
			const response = await axios.get(checkHome());
			setResults(response.data.hits);
			setInput(query);
		} catch (err) {
			setError(err);
		}
		setLoading(false);
		setHome(false);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		fetchData();
	};
	const handleClearSearch = (e) => {
		setQuery('');
		searchInputRef.current.focus();
	};

	return (
		<div className='container max-w-md mx-auto p-4 m-2 bg-gray-300 flex flex-col'>
			<h1 className='text-grey-800 font-medium mb-4'>H - N E W S</h1>
			<form className='mb-8 flex' onSubmit={handleSearch}>
				<input
					className='border-2 border-gray-400 flex-auto m-2 ml-0'
					type='text'
					onChange={(e) => setQuery(e.target.value)}
					value={query}
					ref={searchInputRef}
				/>
				<button
					className='flex-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2'
					type='submit'>
					Search
				</button>
				<button
					className='flex-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2'
					type='button'
					onClick={handleClearSearch}>
					Clear
				</button>
			</form>
			{input ? (
				<h2 className='font-extrabold mb-2'>
					Search Results for {input && JSON.stringify(input, null, 2)}:
				</h2>
			) : (
				''
			)}
			{loading ? (
				<div className='font-black text-gray-700'>
					L o a d i n g r e s u l t s . . .
				</div>
			) : (
				<ul className='bg-white p-6'>
					{results.map((result) => (
						<li
							className='bg-white py-2 font-extrabold border-b-2 border-grey-600'
							key={result.objectID}
							id={result.objectID}>
							<a
								className='text-gray-700 hover:text-gray-500'
								href={result.url}>
								{result.title}
							</a>
						</li>
					))}
				</ul>
			)}
			{error && <div>{error.message}</div>}
		</div>
	);
}
