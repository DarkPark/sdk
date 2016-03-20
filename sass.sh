#!/usr/bin/env bash

cd spasdk
# build
(cd app && npm run-script sass)
(cd component && npm run-script sass)
(cd component-button && npm run-script sass)
(cd component-checkbox && npm run-script sass)
(cd component-grid && npm run-script sass)
(cd component-list && npm run-script sass)
(cd component-page && npm run-script sass)
(cd component-panel && npm run-script sass)

cd stbsdk
# build
(cd app && npm run-script sass)
(cd component && npm run-script sass)
(cd component-button && npm run-script sass)
(cd component-checkbox && npm run-script sass)
(cd component-grid && npm run-script sass)
(cd component-list && npm run-script sass)
(cd component-page && npm run-script sass)
(cd component-panel && npm run-script sass)
