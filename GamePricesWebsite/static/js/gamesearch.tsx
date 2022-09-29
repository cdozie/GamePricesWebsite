import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, BrowserRouter, Link,useSearchParams } from "react-router-dom";
import {fetchgeneral, noticentering,offscreentransition,onscreentransition, dateconversion} from './generalfuncs';


const GameSearchPG = () => {
    let params = useParams()
    const[AllGames, setAllGames] = useState([])
    const[SrchPGS, setSrchPGS] = useState([])
    const[SearchParams, setSearchParams]= useSearchParams();
    // let link = `/gamesearch/${params.search}&page=${SearchParams.get('page')}`
    useEffect(() => {
        $.ajax({
            type: "GET",
            url: `/gamesearch?search=${encodeURIComponent(SearchParams.get('search').trim())}&page=${SearchParams.get('page')}`,
            success:function(){
                fetchgeneral(`getsearchdata`,setAllGames)
                fetchgeneral('getsearchpgs',setSrchPGS)

            }
        })

    }, [params,SearchParams])


    return(
        <div className = "game-search-page">
        {SearchParams.get('search').trim()  
        ?(<h2 className = "hmpg-titles left-align">SEARCH RESULTS: {SearchParams.get('search')}</h2>)
        :(<h2 className = "hmpg-titles left-align">All Items</h2>)
        }

            <div className='game-search-results'>
            {AllGames.map((gameitem) => 
            <span className='col-lg-2 col-md-3 col-sm-4 col-6 search-game-item' key = {`${gameitem.idpsngamedata}`}>
                <Link to = {`/game/${gameitem.idpsngamedata}`} >
                    <div className = "item" > 
                        {/* <div className='img-cell'> */}
                        {/* <input name = "rand-game-slug" style={{display: "none"}} value={formval} onChange = {value}></input> */}
                        <img  className = "game-image-items" src = {gameitem.mainimage}></img> 
                        {/* </div> */}
                        <div className = "item-text"
                        id = {`${gameitem.idpsngamedata}`}>{gameitem.gamename}</div>
                        <div className = "platform-text">
                            Platforms: {gameitem.platform}
                        </div>
                        <div className = "hmpg-price-details">
                        {gameitem.currentpsnprice != gameitem.defaultprice &&

                        <span> 
                            <s className = "muted-text">{gameitem.defaultprice}</s> 
                            <strong> {gameitem.currentpsnprice} </strong> 

                        <span className="hmpg-discount">{gameitem.percentoff}</span>
                        {dateconversion(gameitem.psn_sale_end) != "Unknown" && 
                                <div className ="hmpg-sale-ends">
                                    Sale Ends on: {dateconversion(gameitem.psn_sale_end)}
                                </div>
                        }

                        </span>
                        }
                        {gameitem.currentpsnprice == gameitem.defaultprice &&
                            <span>
                                <strong className = "muted-text">{gameitem.defaultprice} </strong> 

                            </span>
                        }

                    </div>

                    {/* } */}
                    </div>
                </Link>

            </span>
   
            )}
            </div>
            <div className = "search-result-chunks">
                {
                    SrchPGS.map((page) =>
                    <span>
                    {page != "..." 
                    ?( <Link to = {`/gamesearch?search=${SearchParams.get('search')}&page=${page}`} className="search-chunk"> {page}</Link>
                    )
                    :(<span className = "search-chunk">{page}</span>)

                    }
                    </span>
                    )
                }
            </div>
        </div>
    )
}
export default GameSearchPG
