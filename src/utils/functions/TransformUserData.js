const global_var = require('../global_var.json')

function bloc_is_reviewed(bloc){
  return bloc?.reviews && bloc.reviews.length > 0;
}

export default function transform_users_data(users){
  const JOURNEY_PROGRESS_CAP = global_var.JOURNEY_PROGRESS_CAP
  const user_transformed_data = users.map(user => {
    const user_blocs_length = user.Journey_Infos.blocs?.length
    const name = user.Discord_Infos.displayName
    const img = user.Discord_Infos.avatar_url || require('../../img/discord.svg')

    let one_good = false;
    let one_wrong = false;

    for(const key in user.Student_Perks){
      const actual = user.Student_Perks[key]
      if(key === "_id") continue
      if(!Array.isArray(actual)){
        console.log('ERROR IS NOT ARRAY');
        continue
      }
      if(!actual.length){
        one_wrong = true;
      } else {
        one_good = true;
      }
    }

    const status = !user_blocs_length ? 'Just started' :  (user.Journey_Infos.blocs.some(bloc=> !bloc_is_reviewed(bloc) && bloc.completed) || (user.Journey_Infos.progress === JOURNEY_PROGRESS_CAP && bloc_is_reviewed(user.Journey_Infos.blocs[user_blocs_length - 1]) ))  ? "Not reviewed" : user.Journey_Infos.blocs.some(bloc=>!bloc.reviewed) ? 'In progress' : (user.Journey_Infos.progress === JOURNEY_PROGRESS_CAP && !user.Journey_Infos.blocs.some(bloc => !bloc_is_reviewed(bloc)))  ? 'Finished' : 'Reviewed' ;
    const fiche_state_color = (one_good && one_wrong) ? '🟠' : !one_wrong ? '🟢' : '🔴' ;
    const progress = user.Journey_Infos.progress
    const subscription = user.Discord_Infos.grade
    const user_id = user._id
    
    return {name, status, fiche_state_color, progress, img, subscription, user_id}

  })
  return user_transformed_data
}

