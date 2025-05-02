import { useDispatch } from "react-redux";
import {
  getCollaborators,
  getTotalCommits,
  getTotalPullRequests,
} from "../containers/dashboard/apiUtils";
import {
  addCreatedDate,
  addTotalCollaborators,
  addTotalCommits,
  setPulls,
} from "../containers/dashboard/reducer";

export const useDashboardStats = (repoUrl) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      Promise.all([
        getTotalCommits(repoUrl).then((res) => {
          dispatch(addTotalCommits({ data: res?.length }));
          dispatch(addCreatedDate({ data: res?.createdYear }));
        }),
        getCollaborators(repoUrl).then((res) => {
          if (res.status !== 403) {
            dispatch(addTotalCollaborators({ data: res?.length }));
          }
        }),
        getTotalPullRequests(repoUrl).then((res) => {
          dispatch(setPulls({ data: res?.length }));
        }),
      ]).finally(() => {
        setLoading(false);
      });
    };

    if (repoUrl) fetchStats();
  }, [dispatch, repoUrl]);

  return loading;
};
