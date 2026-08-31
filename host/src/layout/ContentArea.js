import React from 'react';

function ContentArea({ activeTab, contentMap }) {
  const currentContent = contentMap[activeTab] || contentMap.products;

  return <div className="content">{currentContent}</div>;
}

export default ContentArea;
