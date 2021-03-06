import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import TimeAgo from 'timeago-react';
import moment from 'moment';
import _ from 'lodash';
import { parse as parseMongoId } from '../../utils/mongoId';

import i18n from '../../utils/i18n';
import * as recordEnum from '../../constant/record';

const shouldShowDetail = (data) =>
    recordEnum.STATUS_SCRATCHPAD_SHOW_DETAIL_FLAGS[data.status];

const isPretest = (data) =>
data.type === recordEnum.TYPE_PRETEST;

const getRecordDetail = (data) => {
    if (!shouldShowDetail(data) || !isPretest(data)) {
        return (
            <a
                className={`record-status--text ${recordEnum.STATUS_CODES[data.status]}`}
                href={data.url}
                target="_blank"
            >
                {recordEnum.STATUS_TEXTS[data.status]}
            </a>
        );
    }
    const stat = _.pick(
        _.groupBy(data.cases || [], 'status'),
        _.keys(recordEnum.STATUS_SCRATCHPAD_SHORT_TEXTS)
    );
    return _.map(recordEnum.STATUS_SCRATCHPAD_SHORT_TEXTS, (text, status) => {
        const count = (stat[status] && stat[status].length) || 0;
        const cn = classNames('icol icol--stat', {
            'record-status--text': count > 0,
            [recordEnum.STATUS_CODES[data.status]]: count > 0,
        });
        return (
            <span key={text} className={cn}>
                {text}: {count}
            </span>
        );
    });
};

const mapStateToProps = (state) => ({
    items: state.records.items,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...dispatchProps,
    data: stateProps.items[ownProps.id],
});

@connect(mapStateToProps, null, mergeProps)
export default class ScratchpadRecordsRowContainer extends React.PureComponent {
    render() {
        const { data } = this.props;
        const submitAt = parseMongoId(data._id).timestamp * 1000;
        return (
            <tr>
                <td className={`col--detail record-status--border ${recordEnum.STATUS_CODES[data.status]}`}>
                    <span className={`icon record-status--icon ${recordEnum.STATUS_CODES[data.status]}`}></span>
                    {getRecordDetail(data)}
                    <span className="icol icol--pretest">
                        {isPretest(data)
                            ? <span
                                className={`flag record-status--background ${recordEnum.STATUS_CODES[data.status]}`}
                            >{i18n('Pretest')}</span>
                            : ''
                        }
                    </span>
                </td>
                <td className="col--memory">
                    {shouldShowDetail(data) ? `${Math.ceil(data.memory_kb / 1000)} MB` : '-'}
                </td>
                <td className="col--time">
                    {shouldShowDetail(data) ? `${data.time_ms}ms` : '-'}
                </td>
                <td className="col--at">
                    <time data-tooltip={moment(submitAt).format('YYYY-MM-DD HH:mm:ss')}>
                        <TimeAgo datetime={submitAt} locale={i18n('timeago_locale')} />
                    </time>
                </td>
            </tr>
        );
    }
}
