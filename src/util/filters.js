import moment from "moment";

export function timeAgo(date) {
  return moment(new Date(date)).fromNow(true) + " ago";
}
