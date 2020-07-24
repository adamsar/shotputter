import * as React from "react";
import {useMemo} from "react";
import {observer} from "mobx-react-lite";
import {GithubError} from "@shotputter/common/src/main/ts/services/poster/github/GithubPoster";
import {Loader} from "../processor/Loader";
import {useStores} from "../../stores";
import {Modal} from "../common/Modal";
import {RequiredStar} from "../common/forms/RequiredStar";
import ReactTags from 'react-tag-autocomplete';
import {IfFulfilled, IfInitial, IfPending, IfRejected, useAsync} from "react-async";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import merge from "lodash/merge";
import {ErrorModal} from "../common/ErrorModal";
import * as t from "@shotputter/common/node_modules/io-ts";
import {withMessage} from "@shotputter/common/node_modules/io-ts-types/lib/withMessage"
import {NonEmptyString} from "@shotputter/common/node_modules/io-ts-types/lib/NonEmptyString";
import {decodeForm, ShotputFormError} from "@shotputter/common/src/main/ts/util/form-validation";
import {pipe} from "fp-ts/lib/pipeable";
import {fold} from "fp-ts/lib/Either";
import {SuccessModal} from "../common/SuccessModal";
import {DelayedAction} from "../common/DelayedAction";

interface GithubModal {
   onClose: () => void;
   onFinish: () => void;
}

type GithubModalForm = {
   title: string;
   labels: string[];
   owner: string;
   repo: string;
};

const validator: t.Type<GithubModalForm, GithubModalForm> = t.type({
   title: t.intersection([
       withMessage(t.string, (x: unknown) => {
      if (x === null || x === undefined) {
         return "required"
      } else {
         return "string_required"
      }
      }),
      NonEmptyString
       ]),
   labels: t.array(t.string),
   owner: t.string,
   repo: t.string
});

export const GithubModal = observer(({onClose}: GithubModal) => {
   const {  screenshot, global } = useStores();
   const githubService = global.githubService;

   const loadRepoState = useAsync(useMemo(() => taskEitherExtensions.toDeferFn(githubService.listRepos()), []));
   const { data: repos, isFulfilled: reposLoaded } = loadRepoState;
   const [form, setForm] = React.useState<Partial<GithubModalForm>>({
      labels: global.appOptions?.github?.defaultLabels ?? [],
   });

   const [errors, setErrors] = React.useState<ShotputFormError>();

   const postState = useAsync({deferFn: ([form]: [GithubModalForm]) => {
      return taskEitherExtensions.toDeferFn(githubService.postIssue({
            post: screenshot.post,
            ...form
         }))();
      }})

   function updateForm(obj: Partial<GithubModalForm>) {
      setForm(merge({}, form, obj))
   }

   const onAddTag = (tag: string) => {
      updateForm({labels: form.labels.concat(tag)});
   };

   const onDeleteTag = (index: number) => {
      updateForm({labels: form.labels.filter((_, _index) => _index !== index)});
   };

   React.useEffect(() => {
      if (reposLoaded) {
         setForm(merge({}, form, {
            owner: repos.find(({owner}) => owner === global.appOptions.github?.defaultOwner) ?? repos[0].owner,
            repo: repos.find(({repo}) => repo === global.appOptions.github?.defaultRepo)?.repo ?? repos[0].repo
         }))
      }
   }, [repos]);

   const onPost = () => pipe(
       decodeForm(validator, {...form, repo: (form.repo || global.appOptions.github?.defaultRepo), owner: form.owner ?? global.appOptions?.github?.defaultOwner}),
       fold(
           errors => {
               console.error(errors);
               setErrors(errors)
           },
           (form) => {
              postState.run(form);
              setErrors(undefined);
           }
       )
   );

   const defaultRepo = global.appOptions?.github?.defaultRepo;
   const defaultOwner = global.appOptions?.github?.defaultOwner;
   return (
       <>
          <IfPending state={loadRepoState}>
             <Loader/>
          </IfPending>
          <IfRejected state={loadRepoState}>{(error: GithubError, _) => (
              <ErrorModal onClose={onClose}>
                 An error has occurred while fetching repository data from Github<br/>
                 <code>
                    {
                       JSON.stringify(error)
                    }
                 </code>
              </ErrorModal>
          )
          }</IfRejected>
          <IfFulfilled state={loadRepoState}>{ _ => (<>
                 <IfInitial state={postState}>
                    <Modal onClose={onClose}>
                       <h3>Post issue on Github</h3>
                       <div className={"shotput-left-align"}>
                          <div className={"shotput-label"}>
                             Repo
                          </div>
                          <div className={"shotput-field-container"}>
                             <select onChange={({target: {value: repoOwner}}) => {
                                 const [owner, repo] = repoOwner.split("/")
                                 updateForm({owner, repo});
                             }} defaultValue={(defaultRepo && defaultOwner) ? (defaultOwner + "/" + defaultRepo) : (repos[0]?.owner + "/" + repos[0]?.repo)}>
                                {
                                   repos.map(repo => (
                                       <option key={repo.repo} value={repo.owner + "/" + repo.repo}>{repo.owner}/{repo.repo}</option>
                                   ))
                                }
                             </select>
                          </div>
                          <div className={"shotput-label"}>
                             Title <RequiredStar/>
                          </div>
                          <div className={"shotput-field-container"}>
                             <input type={"text"} onChange={({target: {value: title}}) => updateForm({title})} className={errors?.title ? "shotput-field-error" : ""}/>
                             {
                                errors?.title ? (<div className={"shotput-field-error-box"}>{errors.title}</div>) : null
                             }
                          </div>
                          <div className={"shotput-label"}>
                             Labels
                          </div>
                          <div className={"shotput-field-container"}>
                             <ReactTags
                                 tags={form.labels.map((label: string) => ({
                                    id: label,
                                    name: label
                                 }))}
                                 onAddition={(tag) => {
                                    onAddTag(tag.name);
                                 }}
                                 onDelete={(index) => {
                                    onDeleteTag(index);
                                 }}
                                 allowNew={true}
                             />
                          </div>
                          <div className={"shotput-bottom-buttons"}>
                             <span className={"shotput-bottom-button"} onClick={onClose}>Back</span>
                             <span className={"shotput-bottom-button"} onClick={onPost}>Post</span>
                          </div>
                       </div>
                 </Modal>
                 </IfInitial>
                 <IfPending state={postState}>
                    <Loader/>
                 </IfPending>
                 <IfRejected state={postState}>{ (error: GithubError, _) => (
                     <Modal onClose={onClose}><pre>{JSON.stringify(error, null, 2)}</pre></Modal>
                 )}
                 </IfRejected>
                 <IfFulfilled state={postState}>{ (_) => (<>
                        <SuccessModal onClose={onClose}>
                            Issue successfully submitted to Github!
                        </SuccessModal>
                        <DelayedAction delay={5000} func={onClose}/>
                    </>)
                 }
                 </IfFulfilled>
              </>
          )
          }
          </IfFulfilled>
       </>

   )
});
