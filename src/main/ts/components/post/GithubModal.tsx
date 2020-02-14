import * as React from "react";
import {observer} from "mobx-react-lite";
import {RepoInfo} from "../../services/poster/github/GithubPoster";
import {Loader} from "../processor/Loader";
import {useStores} from "../../stores";
import {Modal} from "../common/Modal";

interface GithubModal {
   onClose: () => void;
   onFinish: () => void;
}

export const GithubModal = observer(({onClose, onFinish}: GithubModal) => {
   const { screenshot } = useStores();
   const githubPoster = screenshot.githubPoster;
   const [repos, setRepos] = React.useState<RepoInfo[]>([]);
   const [isLoading, setIsLoading] = React.useState<boolean>(false);
   const [isError, setIsError] = React.useState<boolean>(false);
   const [currentRepo, setCurrentRepo] = React.useState<RepoInfo>(
       (githubPoster.config?.owner && githubPoster.config?.repo) ? {
          owner: githubPoster.config?.owner,
          repo: githubPoster.config?.repo
       } : null
   );
   const [title, setTitle] = React.useState<string>(null);


   React.useEffect(() => {
      if (!githubPoster.config.owner || !githubPoster.config.owner) {
         setIsLoading(true);
         githubPoster.listRepos().then(repos => {
            setIsLoading(false);
            setRepos(repos);
            setCurrentRepo(repos[0]);
         }).catch((error) => {
            console.error(error);
            setIsError(true)
 ***REMOVED***
      }
   }, []);

   const onPost = () => {
      githubPoster.setConfig({
          ...currentRepo,
         title
      });
      setIsLoading(true);
      githubPoster.send(screenshot.post).then(() => {
         setIsLoading(false);
         onFinish();
      }).catch((error) => {
         console.warn(error);
         setIsError(true);
      });
   };

   if (isError) {
      return <Modal onClose={onClose}>Error</Modal>
   }else if (isLoading) {
      return <Loader />;
   } else {
      return (
          <Modal onClose={onClose}>
             <h3>Post issue on Github</h3>
     ***REMOVED***
                <div className={"shotput-label"}>
                   Repo
        ***REMOVED***
                <div className={"shotput-field-container"}>
                   <select onChange={(value) => setCurrentRepo(repos.find(repo => repo.repo === value.target.value))}>
                      {
                         repos.map(repo => (
                             <option key={repo.repo} value={repo.repo}>{repo.owner}/{repo.repo}</option>
                         ))
          ***REMOVED***
                   </select>
        ***REMOVED***
                <div className={"shotput-label"}>
                   Title
        ***REMOVED***
                <div className={"shotput-field-container"}>
                   <input type={"text"} onChange={event => setTitle(event.target.value)}/>
        ***REMOVED***
                <div className={"shotput-bottom-buttons"}>
                   <span className={"shotput-bottom-button"} onClick={onClose}>Back</span>
                   <span className={"shotput-bottom-button"} onClick={onPost}>Post</span>
        ***REMOVED***
     ***REMOVED***
          </Modal>
      );
   }
});