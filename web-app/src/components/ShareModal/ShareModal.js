import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  FacebookShareButton,
  GooglePlusShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  RedditShareButton,
  PinterestShareButton,
  FacebookIcon,
  GooglePlusIcon,
  WhatsappIcon,
  TwitterIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  LinkedinIcon,
  RedditIcon,
  PinterestIcon,
} from 'react-share';
import { CloseIcon } from '../common/Icons';
import {
  actions as appActions,
  selectors as appSelectors,
} from '../../reducers/app';
import './ShareModal.css';

class ShareModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showShareModal: props.showShareModal,
      emailToShare: '',
    };
  }

  componentDidMount() {
    window.LineIt.loadButton();
    // initializing Line share button
  }

  componentWillReceiveProps({ showShareModal }) {
    this.setState({
      showShareModal,
    });
  }

  hideShareModal = () => {
    this.props.hideShareModal();
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const {
      hideShareModal,
      header,
      url,
      image,
      description,
      title,
    } = this.props;
    const mailToLink =
    `mailto:${this.state.emailToShare}?subject=${title}&body=${description} ${url}`;
    const content =
    description && (description.length > 150 ? `${description.substr(0, 150)}...` : description);
    return (
      <div
        className={classnames(
          'ShareModal-container', { 'is-open': this.state.showShareModal })
        }
      >
        <div className="ShareModal-cover" />
        <div className="ShareModal">
          <div className="ShareModal-header">
            <span className="ShareModal-title">{header}</span>
            <div
              className="ShareModal-hide"
              onClick={hideShareModal}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="ShareModal-body">
            <div className="ShareModal-email-block">
              <span className="ShareModal-email-header">Share via email</span>
              <div className="ShareModal-email-input">
                <input
                  className="ShareModal-email-input-text"
                  type="email"
                  placeholder="Enter receiver email"
                  onChange={ev =>
                    this.setState({ emailToShare: ev.target.value })}
                />
                <a href={mailToLink}>
                  <div className="ShareModal-email-btn">
                    <p className="ShareModal-email-btn-text">Send</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="ShareModal-socialnets-block">
              <FacebookShareButton
                url={url}
                quote={`${title}
                ${content}`}
              >
                <FacebookIcon size={42} />
                <span className="ShareModal-socialnets-title">Facebook</span>
              </FacebookShareButton>
              <WhatsappShareButton
                url={url}
                title={title}
              >
                <WhatsappIcon size={42} />
                <span className="ShareModal-socialnets-title">WhatsApp</span>
              </WhatsappShareButton>
              <TwitterShareButton
                url={url}
                title={content || title}
              >
                <TwitterIcon size={42} />
                <span className="ShareModal-socialnets-title">Twitter</span>
              </TwitterShareButton>
              <VKShareButton
                url={url}
                title={title}
                description={content}
                image={image}
              >
                <VKIcon size={42} />
                <span className="ShareModal-socialnets-title">VK</span>
              </VKShareButton>
              <OKShareButton
                url={url}
                title={title}
                description={content}
                image={image}
              >
                <OKIcon size={42} />
                <span className="ShareModal-socialnets-title">OK</span>
              </OKShareButton>
              <TelegramShareButton
                url={url}
                title={title}
              >
                <TelegramIcon size={42} />
                <span className="ShareModal-socialnets-title">Telegram</span>
              </TelegramShareButton>
              <GooglePlusShareButton url={url}>
                <GooglePlusIcon size={42} />
                <span className="ShareModal-socialnets-title">Google+</span>
              </GooglePlusShareButton>
              <LinkedinShareButton
                url={url}
                title={title}
                description={content}
              >
                <LinkedinIcon size={42} />
                <span className="ShareModal-socialnets-title">LinkedIn</span>
              </LinkedinShareButton>
              <RedditShareButton
                url={url}
                title={title}
              >
                <RedditIcon size={42} />
                <span className="ShareModal-socialnets-title">Reddit</span>
              </RedditShareButton>
              <PinterestShareButton
                url={url}
                media={image}
                description={content}
              >
                <PinterestIcon size={42} />
                <span className="ShareModal-socialnets-title">Pinterest</span>
              </PinterestShareButton>
              <div className="LineShareButton">
                <div
                  className="line-it-button"
                  data-lang="en"
                  data-type="share-d"
                  data-url={url}
                  style={{ display: 'none' }}
                />
                <span
                  className="ShareModal-socialnets-title Line-btn"
                >
                  LINE it!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ShareModal.propTypes = {
  showShareModal: PropTypes.bool.isRequired,
  hideShareModal: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  image: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
};

ShareModal.defaultProps = {
  image: '',
  description: '',
  title: '',
};

const mapStateToProps = state => ({
  showShareModal: appSelectors.getShowShareModal(state),
});

const mapDispatchToProps = {
  hideShareModal: appActions.hideShareModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareModal);
