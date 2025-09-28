const pb = {
    le: '<:le:1421736039046844477>',
    me: '<:me:1421736027910832158>',
    re: '<:re:1421736030616162395>',
    lf: '<:lf:1421736042511208570>',
    mf: '<:mf:1421736036114894878>',
    rf: '<:rf:1421736033216888903>',
};

function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 14;
    const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
    let emptySquares = progressBarLength - filledSquares || 0;

    if (!filledSquares && !emptySquares) {
        emptySquares = progressBarLength;
    }

    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;

    const progressBar =
        (filledSquares ? pb.lf : pb.le) +
        (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
        (filledSquares === progressBarLength ? pb.rf : pb.re);

    const results = [];
    results.push(
        `👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${
            downvotes.length
        } downvotes (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);

    return results.join('\n');
}

module.exports = formatResults;