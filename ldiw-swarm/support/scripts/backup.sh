#!/bin/bash
BACKUP_DIR="$(date +%d%m%Y_%H%M)"
echo $BACKUP_DIR
mkdir -p /backup/$BACKUP_DIR
mount /mnt && sleep 10
ionice -c2 -n7 tar --use-compress-program=pigz -cf /backup/$BACKUP_DIR/couchdb.tgz -C /mnt/ .
sha1sum /backup/$BACKUP_DIR/couchdb.tgz > /backup/$BACKUP_DIR/couchdb.tgz.sha1
umount /mnt
