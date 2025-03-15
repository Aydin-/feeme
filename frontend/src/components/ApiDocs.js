import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export function ApiDocs() {
  return (
    <div className="api-docs">
      <SwaggerUI url="/swagger.yaml" />
    </div>
  );
} 