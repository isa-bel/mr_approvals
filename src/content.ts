// GitLab UI
const mergeButtonSelector = '.mr-widget-body.media button.btn.btn-success.btn-sm';
const statusIconSelector = '.mr-widget-body.media span.ci-status-icon.ci-status-icon-success';
const authorSelector = '.author-link';
const profileSelector = '.profile-link';
const downVotesSelector = 'gl-emoji[data-name="thumbsdown"] + span.award-control-text.js-counter';
const upVotesSelector = 'gl-emoji[data-name="thumbsup"] + span.award-control-text.js-counter';
// GitLab Style
const successStatusClasses = ['ci-status-icon-success', 'js-ci-status-icon-success'];
const warningStatusClasses = ['ci-status-icon-warning', 'js-ci-status-icon-warning'];
const acceptMergeClass = 'accept-merge-request';
const disabledMergeClass = 'js-disabled-merge-button';
// Constants
const DISABLED = 'disabled';
const SELF = 'you';
const GITLAB = 'GitLab';
const MERGE_REQUEST_PATH = /^\/[a-z0-9\-_\/]+\/merge_requests\/.*/;
const MIN_APPROVALS = 2;
// Messages
const CHANGES_REQUESTED_MSG = 'Some reviewers requested changes. Please address those.';
const APPROVALS_REQUIRED_MSG = 'Requires 2 or more approvals.';

const debugging = false;
const log = (...args: any): boolean | void => debugging && console.log(...args);

function selfVote(voters: string): boolean {
  log({ voters });

  // Case 'you, Alex Doe, and Alix Dae'
  const votersList = voters.toLowerCase().split(', ');
  if (votersList.includes(SELF)) {
    log('Self vote');
    return true;
  }

  // Case 'you and Alex Doe' or 'Alex Doe and you'
  if (votersList.length === 1) {
    log('One or two votes');
    if (votersList[0].split(' and ').includes(SELF)) {
      log('Self vote and friend');
      return true;
    }
  }

  return false;
}

function getVotes(votesSelector: string, isMRAuthor: boolean): number {
  const votesCounter = document.querySelector(votesSelector);
  if (!votesCounter) {
    return 0;
  }

  const votes = parseInt(votesCounter.textContent || '0', 10);
  log({ votes, isMRAuthor });
  if (!isMRAuthor) {
    return votes;
  }

  const votesButton = votesCounter.parentElement as HTMLElement;
  const dataTitle = votesButton.dataset.title;
  const dataOriginalTitle = votesButton.dataset.originalTitle;
  if (selfVote(dataTitle || dataOriginalTitle || '')) {
    return votes - 1;
  }

  return votes;
}

function disableMergeButton(mergeButton: HTMLButtonElement, message: string): void {
  log('Disable button', mergeButton);
  mergeButton.setAttribute(DISABLED, DISABLED);
  mergeButton.classList.replace(acceptMergeClass, disabledMergeClass);
  log('Disabled button', mergeButton);

  const statusIcon = document.querySelector(statusIconSelector) as HTMLElement;
  log('Update icon', statusIcon);
  statusIcon.classList.remove(...successStatusClasses);
  statusIcon.classList.add(...warningStatusClasses);
  statusIcon.style.transform = 'rotate(134deg)';
  log('Updated icon', statusIcon);

  (mergeButton.parentElement as HTMLElement).insertAdjacentHTML('afterend', `<span class="bold">${message}</span>`);
  log('Appended message', mergeButton.parentElement);
}

function verifyApprovals(): void {
  // Host includes 'gitlab'
  const hostname = window.location.hostname;
  if (!hostname.split('.').includes(GITLAB.toLowerCase())) {
    log(`Not in a ${GITLAB} host`, hostname);
    return;
  }

  // Path has the template /.*/merge_requests/.*
  const currentPath = window.location.pathname;
  if (!MERGE_REQUEST_PATH.test(currentPath)) {
    log('Not in Merge Request path', currentPath);
    return;
  }

  const mergeButton = document.querySelector(mergeButtonSelector) as HTMLButtonElement;
  if (!mergeButton) {
    log('No Merge button');
    return;
  }

  const isDisabled = mergeButton.getAttribute(DISABLED);
  if (isDisabled) {
    log('Merge is already disabled');
    return;
  }

  const mrAuthor = (document.querySelector(authorSelector) as HTMLElement).dataset.username;
  const currentUser = (document.querySelector(profileSelector) as HTMLElement).dataset.user;
  const downVotes = getVotes(downVotesSelector, mrAuthor === currentUser);
  if (downVotes > 0) {
    disableMergeButton(mergeButton, CHANGES_REQUESTED_MSG);
    return;
  }

  const upVotes = getVotes(upVotesSelector, mrAuthor === currentUser);
  if (upVotes < MIN_APPROVALS) {
    disableMergeButton(mergeButton, APPROVALS_REQUIRED_MSG);
    return;
  }
}

verifyApprovals();
