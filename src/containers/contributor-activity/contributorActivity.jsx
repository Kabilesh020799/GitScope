import React, { useEffect, useState } from "react";
import './style.scss';
import { addCreatedDate, addTotalCollaborators, replaceCollaborators } from "../dashboard/reducer";
import { useDispatch, useSelector } from "react-redux";
// import BubbleGraph from "../../components/bubble-graph";
import { getAllCollaborators } from "./apiUtils";
import { getCollaborators, getTotalCommits } from "../dashboard/apiUtils";
import BubbleChart from "../../components/bubble-chart";
import { CircularProgress } from "@mui/material";
import './style.scss';

const ContributorActivity = () => {
  const [year, ] = useState(2023);
  const [years, setYears] = useState([]);
  const [filteredCollabs, setFilteredCollabs] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { collaborators, totalCollaborators, createdYear } = useSelector( state => state.commitReducer );

  // filter commits for the year
  const filterYear = (weeks) => {
    const filteredYear =  weeks?.filter((week) => new Date(week?.w * 1000).getFullYear() === year);
    const monthlyData = {};
    
    filteredYear?.forEach((yearItem) => {
      const date = new Date(yearItem?.w * 1000);
      const month = date.getMonth() + 1;
      if (!monthlyData[month]) {
        monthlyData[month] = [];
      }
      monthlyData[month].push(yearItem);
    });
    return monthlyData;
  };

  useEffect(() => {
    if(!totalCollaborators) {
      setLoading(true);
      getCollaborators()
      .then((res) => {
        if(res.status !== 403) {
          dispatch(addTotalCollaborators({data: res?.length}));
        }
      })
      .finally(() => {
        setLoading(false);
      });
    }
    if(!createdYear) {
      setLoading(true);
      getTotalCommits()
        .then((res) => {
          dispatch(addCreatedDate({data: res?.createdYear}));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if(!collaborators?.length && !!totalCollaborators) {
      getAllCollaborators(Math.ceil(totalCollaborators/100))
        .then((res) => {
          if(res.status !== 403) {
            dispatch(replaceCollaborators({ data: res }));
          }
        });
    }
  }, [totalCollaborators]);

  useEffect(() => {
    if(collaborators?.length) {
      collaborators?.forEach((collaborator) => {
        setFilteredCollabs(prevState => [...prevState, { ...collaborator,commits: filterYear(collaborator?.weeks)}]);
      });
    }

    return () => setFilteredCollabs([]);
  }, [collaborators]);

  useEffect(() => {
    if(createdYear) {
      const firstYear = new Date(createdYear).getFullYear();
      const endYear = new Date().getFullYear();
      for(let year = firstYear;year <= endYear;year++) {
        if(!years.includes(year)) { 
          setYears((prevState) => ([...prevState, year]));
        }
      }
    }

    return () => setYears([]);
  }, [createdYear]);

  return (
    <div className="contributor-activity">
      {/* <BubbleGraph
        data={filteredCollabs?.map((collaborator) => ({ ...collaborator?.author, contributions: collaborator?.total, weeks: collaborator?.commits, }))}
      /> */}
      {
        loading ? (
          <div style={{ height: 'calc(100% - 100px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </div>
        ) : (
          <BubbleChart
            data={filteredCollabs?.map((collaborator) => ({ 
              ...collaborator?.author,
              contributions: collaborator?.total,
              weeks: collaborator?.commits,
            }))}
          />
        )
        }
    </div>
  );
};

export default ContributorActivity;
