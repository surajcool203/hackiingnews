import { useState, useEffect } from "react";
import axios from "axios";
import NewsCard from "./cpmponents/NewsCard";
import ReactPaginate from "react-paginate";



const NewsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [query, setQueery] = useState("");
    const [searchInput, setSearchInput] = useState("");




    const handlePageChange = event => {
        console.log(event);
        setCurrentPage(event.selected);
    }

    const handleSubmit = event => {
        event.preventDefault();
        setCurrentPage(0);
        setQueery(searchInput);
    }


    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    "http://hn.algolia.com/api/v1/search?",
                    {
                        params: { page: currentPage, query },
                    }
                );
                const { hits, nbPages } = data;
                setArticles(hits);
                setTotalPages(nbPages);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentPage, query]);


    return (
        <div className="container">
            <div className="toppart">
                <h1>Hacking News</h1>
                <div className="searchbar">
                    <form className="search-form" onSubmit={handleSubmit}>
                        <input
                            placeholder="search for the news"
                            value={searchInput}
                            onChange={event => setSearchInput(event.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>
            <div className="news-container">
                {isLoading ? (
                    <p >Loading..........</p>
                ) : (
                    articles.map((article) => (
                        <NewsCard article={article} key={article.objectID} />
                    ))
                )}
            </div>
            <ReactPaginate
                nextLabel=">>"
                previousLabel="<<"
                breakLabel="..."
                forcePage={currentPage}
                pageCount={totalPages}
                renderOnZeroPageCount={null}
                onPageChange={handlePageChange}
                className="pagination"
                activeClassName="active-page"
                previousClassName="previous-page"
                nextClassName="next-page"
            />
        </div>
    );
};

export default NewsPage;