import os
import sqlite3
import swiftclient

#########################################
# YOUR CONTAINER NAME 
########################################
MY_CONTAINER_NAME = 'ubuntu'

# SQLite DB
db_name = '../demo.db'

# keystone Token
pre_auth_token = 'gAAAAABXuIWyuCQhAA3LisiZa16_lrSv6DW0y2j5qubw9crfdD7JoyWEypzqhQLi2CMEbSqy4SVWqBcmtVHDQayMNQKtfiU2SnEhavH2OonOFcc-L8PEi1vNxT1ZnjYSTt67KxivJ8IDm52kuobM40lDnCfCB8g_m_cUxU1VID5l3krVcrIOKTs'

# Swift URL
pre_auth_url = 'https://cloud1.osic.org:8080/v1/AUTH_0a74f780eebd44a3993e9d778aaec2f0/' 

swift = swiftclient.client.Connection(
  preauthurl=pre_auth_url,
  preauthtoken=pre_auth_token
)

conn = sqlite3.connect('../demo.db');
c = conn.cursor()
c.execute('SELECT * FROM images WHERE storage_backend_id = 1');

images = c.fetchall()
print "Total images: ", len(images)
for image in images:
  local_image_name = '../' + image[5] + '/' + image[6]
  local_image = open(local_image_name)
  res = swift.put_object(
          'eddie',
          image[6],
          local_image)
          
  print res


