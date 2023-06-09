import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getCountries, getActivityCreated } from "../../Redux/actions/actions";
import Card from "../../Components/CardCountry/Card";
import Pagination from "../../Components/Pagination/Pagination";
import style from './Home.module.css';
import FilterContinents from "../../Components/FilterAndOrder/FilterContinents";
import FilterActivity from "../../Components/FilterAndOrder/FilterActivity";
import OrderNameAlpha from "../../Components/FilterAndOrder/OrderAlfa";
import OrderPopulation from '../../Components/FilterAndOrder/OrderPopulation';
import ClearFilter from "../../Components/FilterAndOrder/ClearFilter";
import SearchBar from "../../Components/SearchBar/SearchBar";
import NotFound from "../../Components/NotFound/NotFound";

export default function Home() {
  const dispatch = useDispatch();
  const allCountries = useSelector((state) => state.countries);
  const [currentPage, setCurrentPage] = useState(1);
  const [countryPerPage] = useState(10);
  const indexOfLastCountrys = currentPage * countryPerPage;
  const indexOfFirstCountrys = indexOfLastCountrys - countryPerPage;
  const currentCountrys = allCountries.slice(indexOfFirstCountrys, indexOfLastCountrys);
  const [showNotFound, setShowNotFound] = useState(false);

  const paginado = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getActivityCreated());
  }, [dispatch]);

  useEffect(() => {
    if (currentCountrys.length === 0) {
      setShowNotFound(true);
    } else {
      setShowNotFound(false);
    }
  }, [currentCountrys]);

  return (
    <div className={style.fondo}>
      <div className={style.pagination}>
        <Pagination
          countryPerPage={countryPerPage}
          allCountries={allCountries.length}
          paginado={paginado}
          currentPage={currentPage}
        />
      </div>
      <div className={style.containerHome}>
        <div className={style.buscadorContainer}>
          <div className={style.filtersContainer}>
            <div className={style.filter}>
              <FilterContinents setCurrentPage={setCurrentPage} />
            </div>
            <div className={style.filter}>
              <FilterActivity setCurrentPage={setCurrentPage} />
            </div>
            <div className={style.filter}>
              <OrderNameAlpha setCurrentPage={setCurrentPage} />
            </div>
            <div className={style.filter}>
              <OrderPopulation setCurrentPage={setCurrentPage} />
            </div>
            <div className={style.clear}>
              <ClearFilter setCurrentPage={setCurrentPage} />
            </div>
          </div>
          <div className={style.searchBar}>
            <SearchBar setCurrentPage={setCurrentPage} />
          </div>
        </div>

        <div className={style.cardContainer}>
          {showNotFound ? (
            <NotFound />
          ) : (
            currentCountrys?.map((el) => (
              <Card
                key={el.id}
                id={el.id}
                name={el.name}
                continents={el.continents}
                population={el.population}
                image={el.flags}
                season={el.season}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
