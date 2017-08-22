'use strict';
const azureServer = process.env.AZURE_STORAGE_ACCOUNT;
const azure = require('azure-storage');
const blobService = azure.createBlobService();
const util = require('module-util');

module.exports = {
    getServer: () => azureServer,
    getBlobSAS: (containerName, blobName, expiryMinutes) => {
        const sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: azure.BlobUtilities.SharedAccessPermissions.WRITE,
                Expiry: util.time.getUTCDateShifted(expiryMinutes, 'minutes'),
            },
        };
        const token = blobService.generateSharedAccessSignature(
            containerName, blobName, sharedAccessPolicy);
        const sasUrl = blobService.getUrl(containerName, blobName, token);
        return sasUrl;
    },
    getBlobURL: (containerName, blobName) => blobService.getUrl(containerName, blobName),
    deleteBlob: (containerName, blobName) => {
        return new Promise((resolve, reject) => {
            blobService.deleteBlobIfExists(containerName, blobName, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
};
