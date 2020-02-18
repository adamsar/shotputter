import * as React from "react";
import {observer} from "mobx-react-lite";
import {RepoInfo} from "../../services/poster/github/GithubPoster";
import {Loader} from "../processor/Loader";
import {useStores} from "../../stores";
import {Modal} from "../common/Modal";
import {RequiredStar} from "../common/forms/RequiredStar";
import ReactTags from 'react-tag-autocomplete';

interface GithubModal {
   onClose: () => void;
   onFinish: () => void;
}

interface GithubModalFormErrors {

   title?: string;

}

export const GithubModal = observer(({onClose, onFinish}: GithubModal) => {
   const { screenshot, global } = useStores();
   const githubPoster = screenshot.githubPoster;
   const [repos, setRepos] = React.useState<RepoInfo[]>([]);
   const [isLoading, setIsLoading] = React.useState<boolean>(false);
   const [isError, setIsError] = React.useState<boolean>(false);
   const [labels, setLabels] = React.useState<string[]>(global.appOptions?.github?.labels || []);
   const [errors, setErrors] = React.useState<GithubModalFormErrors>({});
   const [currentRepo, setCurrentRepo] = React.useState<RepoInfo>(
       (githubPoster.config?.owner && githubPoster.config?.repo) ? {
          owner: githubPoster.config?.owner,
          repo: githubPoster.config?.repo
       } : null
   );
   const [title, setTitle] = React.useState<string>(null);

   const onAddTag = (tag: string) => {
      setLabels(labels.concat(tag));
   };

   const onDeleteTag = (index: number) => {
      setLabels(labels.filter((_, _index) => _index !== index));
   };

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

   const validate = (): boolean => {
      if (!title || title.length === 0) {
         setErrors({
            title: "Required"
 ***REMOVED***
         return false;
      } else {
         return true;
      }
   };

   const onPost = () => {
      if (validate()) {
         githubPoster.setConfig({
            ...currentRepo,
            title,
            labels
 ***REMOVED***
         setIsLoading(true);
         githubPoster.send(screenshot.post).then(() => {
            setIsLoading(false);
            onFinish();
         }).catch((error) => {
            console.warn(error);
            setIsError(true);
 ***REMOVED***
      }
   };

   if (isError) {
      return <Modal onClose={onClose}>Error</Modal>
   }else if (isLoading) {
      return <Loader />;
   } else {
      return (
          <Modal onClose={onClose}>
             <h3>Post issue on Github</h3>
             <div className={"shotput-left-align"}>
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
                   Title <RequiredStar/>
        ***REMOVED***
                <div className={"shotput-field-container"}>
                   <input type={"text"} onChange={event => setTitle(event.target.value)} className={errors.title ? "shotput-field-error" : ""}/>
                   { errors.title ? (<div className={"shotput-field-error-box"}>{errors.title}***REMOVED***) : null }
        ***REMOVED***
                <div className={"shotput-label"}>
                   Labels
        ***REMOVED***
                <div className={"shotput-field-container"}>
                   <ReactTags
                       tags={labels.map((label: string) => ({
                          id: label,
                          name: label
           ***REMOVED***))}
                       onAddition={(tag) => {
                          onAddTag(tag.name);
           ***REMOVED***}
                       onDelete={(index) => {
                          onDeleteTag(index);
           ***REMOVED***}
                       allowNew={true}
                   />
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