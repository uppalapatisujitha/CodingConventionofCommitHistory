// Generated by CoffeeScript 1.10.0
(function() {
  var _, archiveDir, deleteArchiveFile, findMongoImportCmd, fs, getConventionByLang, getHighlightName, hasLang, helpers, hljs, https, importIntoMongodb, logger, makeResult, mergeConvention, mongoImportCmd, parser, path, persistence, schedule, service, spawn, timeline, zlib;

  logger = (require('./helpers')).logger;

  helpers = require('./helpers');

  https = require('https');

  fs = require('fs');

  zlib = require('zlib');

  path = require('path');

  spawn = require('child_process').spawn;

  persistence = require('./persistence');

  timeline = require('./timeline');

  parser = require('./parser/parser');

  schedule = require('node-schedule');

  _ = require('underscore');

  hljs = require('highlight.js');
  

  persistence.open(function(err) {
    if (err != null) {
      return logger.error('mongodb is not connected', {
        err: err
      });
    }
    return logger.info('mongodb is connected');
  });

  archiveDir = __dirname + "/archive";

  fs.exists(archiveDir, function(exist) {
    if (!exist) {
      return fs.mkdirSync(archiveDir);
    }
  });

  service = module.exports = {
    totalDesc: {
      lastUpdate: null,
      startDate: null,
      endDate: null,
      regdate: null
    },
    fetchGithubArchive: function(repoName, callback) {
        var options = {
            host:'api.github.com',
            path: repoName,
            method: 'GET',
            headers: {'user-agent': 'node.js'},
            port:443
        };
      return (https.get(options, function(res) {
        var fstream;
        var datetime = "TestTableAgain";
        fstream = fs.createWriteStream(archiveDir + "/" +datetime +'.json');
        var str ='';
        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            
            fstream.write(str);
            fstream.end();
            return importIntoMongodb(datetime, callback);
        });    
     /* return (http.get("http://data.githubarchive.org/" + datetime + ".json.gz", function(res) {
        var fstream, gzip, unzip;
        gzip = zlib.createGunzip();
        fstream = fs.createWriteStream(archiveDir + "/" + datetime + ".json");
        unzip = res.pipe(gzip);
        unzip.pipe(fstream);
        return unzip.on('end', function() {
          logger.info("downloaded " + datetime + ".json");
          return importIntoMongodb(datetime, callback);
        });*/
      })).on('error', function(e) {
        return logger.error('fetch githubarchive: ', {
          err: e
        });
      });
    },
    progressTimeline: function(callback) {
        
      return persistence.findOneWorklogToProcess(function(err, worklog) {

              return persistence.findTimeline(worklog.file, function(err, cursor) {
                var innerLoop, isCompleted, processCount;
               
               
                isCompleted = false;
                processCount = 0;
                innerLoop = function(cur, concurrency) {
                  if ((concurrency != null) && concurrency > 1) {
                    innerLoop(cur, concurrency - 1);
                  }
                  if ((concurrency != null) && concurrency > 1) {
                    logger.debug("start batch #" + concurrency);
                  }
                  processCount += 1;
                  return cur.nextObject(function(err, item) {
                    var invokedInnerLoop, urls;
                    if (err != null) {
                      logger.error("in nextObject: ", {
                        err: err
                      });
                      return;
                    }
                    if (item != null) {
                      logger.debug("found item", {
                        item: item._id
                      });
                      
                      urls = timeline.getCommitUrls(item);
                      logger.debug("urls: " + urls.length + " - ", {
                        urls: urls
                      });
                      if (urls.length === 0) {
                        innerLoop(cur);
                        return;
                      }
                      invokedInnerLoop = false;
                      return urls.forEach(function(url) {
                        return timeline.getCommitInfo(url, function(err, commit) {
                          var conventions;
                          if (err != null) {
                            logger.error('getCommitInfo: ', {
                              err: err,
                              limit: /^API Rate Limit Exceeded/i.test(err.message),
                              isCompleted: isCompleted,
                              processCount: processCount
                            });
                           
                              return innerLoop(cur);
                            
                          } else {
                            logger.debug("parsing commit " + url + " : ", {
                              commit: commit
                            });
                            conventions = parser.parse(commit);
                            logger.debug("get conventions ", {
                              convention: conventions
                            });
                            conventions.forEach(function(conv) {
                              var data;
                              data = {
                                file: worklog.file,
                                lang: conv.lang,
                                convention: conv,
                                regdate: new Date()
                              };
                              return persistence.insertConvention(data, function(err) {
                                if (err != null) {
                                  logger.error('insertConvention', {
                                    err: err
                                  });
                                }
                                return logger.info("insered convention - " + processCount);
                              });
                            });
                            logger.debug("before callback " + invokedInnerLoop + " - " + item._id);
                            if (!invokedInnerLoop) {
                              logger.debug("call recurrsive - " + item._id);
                              innerLoop(cur);
                              return invokedInnerLoop = true;
                            }
                          }
                        });
                      });
                    } else {
                      logger.debug("no item - " + processCount);
                      if (!isCompleted && processCount > 10) {
                        isCompleted = true;
                        return persistence.completeWorklog(worklog._id, function(err) {
                          if (err != null) {
                            isCompleted = false;
                            logger.error('completeWorklog: ', {
                              err: err
                            });
                          }
                          return logger.debug('completed worklog', {
                            file: worklog.file
                          });
                        });
                      }
                    }
                  });
                };
                innerLoop(cursor, 5);
                return callback();
              });
            
       
      });
    },
    summarizeScore: function(callback) {
      return persistence.findOneWorklogToSummarize(function(err, worklog) {
        if (err != null) {
          logger.error('findOneWorklogToSummarize: ', {
            err: err
          });
        }
        if ((err != null) || (worklog == null)) {
          return callback();
        }
        
          return persistence.findConvention(worklog.file, function(err, cursor) {
            if (err != null) {
              logger.error('findConvention: ', {
                err: err
              });
              return;
            }
            return cursor.toArray(function(err, docs) {
              var conventionList, fileOfDay, i, item, key, len, mergeInExistConvention, ref, value;
              conventionList = [];
              docs.forEach(function(doc) {
                var baseConv;
                if (hasLang(conventionList, doc)) {
                  baseConv = getConventionByLang(doc.lang, conventionList);
                  return mergeConvention(baseConv.convention, doc.convention);
                } else {
                  delete doc._id;
                  doc.regdate = new Date;
                  doc.shortfile = doc.file.substr(0, doc.file.lastIndexOf('-'));
                  return conventionList.push(doc);
                }
              });
              for (i = 0, len = conventionList.length; i < len; i++) {
                item = conventionList[i];
                ref = item.convention;
                for (key in ref) {
                  value = ref[key];
                  if (value.commits != null) {
                    value.commits = value.commits.length;
                  }
                }
              }
              fileOfDay = worklog.file.substr(0, worklog.file.lastIndexOf('-'));
              mergeInExistConvention = function(convList) {
                var conv;
                if (convList.length) {
                  conv = convList.pop();
                  return persistence.findScoreByFileAndLang(fileOfDay, conv.lang, function(err, item) {
                    if (err != null) {
                      logger.error('findScoreByFile', {
                        err: err
                      });
                      return;
                    }
                    logger.debug('findScoreByFileAndLang', {
                      item: item
                    });
                    if (item != null) {
                      mergeConvention(conv.convention, item.convention, conv._id = item._id);
                    }
                    return persistence.upsertScore(conv, function(err) {
                      if (err != null) {
                        logger.error('upsertScore', {
                          err: err
                        });
                      }
                      logger.info('upserted score', {
                        conv: conv
                      });
                      return mergeInExistConvention(convList);
                    });
                  });
                } else {
                  return persistence.summarizeWorklog(worklog._id, function(err) {
                    if (err != null) {
                      logger.error('summarizeWorklog', {
                        err: err
                      });
                      return;
                    }
                    logger.info('summarized worklog', {
                      file: worklog.file
                    });
                    return persistence.dropTimeline(worklog.file, function(err) {
                      if (err != null) {
                        logger.error('drop timeline collection', {
                          err: err
                        });
                        return;
                      }
                      return logger.info('dropped timeline collection', {
                        collection: worklog.file
                      });
                    });
                  });
                }
              };
              mergeInExistConvention(conventionList);
              return callback();
            });
          });
       
      });
    },
    findScore: function(lang, callback) {
      return persistence.findScoreByLang(lang, function(err, cursor) {
        var dailyData, langParser, languageDescription;
        if (err != null) {
          logger.error('findScoreByLang', {
            err: err
          });
          return callback(err);
        }
        langParser = parser.getParser("." + lang);
        if (langParser) {
          languageDescription = parser.getParser("." + lang).parse("", {}, "");
        } else {
          callback(new Error(lang + " is not found"));
        }
        dailyData = [];
        return cursor.toArray(function(err, docs) {
          if (err != null) {
            logger.error("findScoreByLang toArray", {
              err: err
            });
          }
          logger.debug("findByLang", {
            docs: docs
          });
          if (docs != null ? docs.length : void 0) {
            docs.forEach(function(doc) {
              var key, score;
              for (key in doc.convention) {
                if (key !== 'lang') {
                  doc.convention[key].title = languageDescription[key].title;
                  doc.convention[key].column = languageDescription[key].column;
                }
              }
              score = {
                lang: lang,
                file: doc.shortfile,
                convention: doc.convention
              };
              return dailyData.push(score);
            });
            return makeResult(lang, dailyData, callback);
          } else {
            return callback(new Error(lang + " is not found"));
          }
        });
      });
    },
    findDescription: function(force, callback) {
      var desc;
      if (!force && (service.totalDesc.regdate != null) && (new Date - service.totalDesc.regdate) < 3600000) {
        return callback(null, service.totalDesc);
      } else {
        desc = {};
        return persistence.findLastestScore(function(err, item) {
          if (err != null) {
            logger.error('findLastestScore', {
              err: err
            });
            return callback(err);
          }
          if (item != null) {
            service.totalDesc.lastUpdate = item.file;
            return persistence.findPeriodOfScore(function(err, docs) {
              if (err != null) {
                logger.error('findPeriodOfScore', {
                  err: err
                });
                return callback(err);
              }
              if ((docs != null ? docs.length : void 0) > 0) {
                docs.sort(function(a, b) {
                  if (a.shortfile > b.shortfile) {
                    return 1;
                  } else {
                    return -1;
                  }
                });
                service.totalDesc.startDate = docs[0].shortfile;
                service.totalDesc.endDate = docs[docs.length - 1].shortfile;
                service.totalDesc.regdate = new Date;
                return callback(null, service.totalDesc);
              }
            });
          } else {
            return callback(null, service.totalDesc);
          }
        });
      }
    }
  };

  hasLang = function(sum, elem) {
    return sum.some(function(el) {
      return el.lang === elem.lang;
    });
  };

  getConventionByLang = function(lang, convList) {
    var result;
    result = null;
    convList.forEach(function(elem) {
      if (elem.lang === lang) {
        return result = elem;
      }
    });
    return result;
  };

  getHighlightName = function(lang) {
    var map;
    map = {
      js: 'javascript',
      java: 'java',
      py: 'python',
      scala: 'scala',
      rb: 'ruby',
      cs: 'cs',
      php: 'php'
    };
    return map[lang];
  };

  mongoImportCmd = "mongoimport";

  findMongoImportCmd = function(datetime, callback) {
    var which;
    if (mongoImportCmd) {
      return callback(null, mongoImportCmd);
    } else {
      which = spawn('which', ["mongoimport"]);
      which.stdout.on('data', function(data) {
        return mongoImportCmd = data.toString();
      });
      return which.on('exit', function(code) {
        if (code === 0) {
          if (mongoImportCmd.match(/([\w\/]+)/)) {
            mongoImportCmd = mongoImportCmd.match(/([\w\/]+)/)[0];
          }
          return callback(null, mongoImportCmd);
        } else {
          logger.error("mongoimport doesn't exist.");
          return callback(code);
        }
      });
    }
  };

  importIntoMongodb = function(datetime, callback) {
    return findMongoImportCmd(datetime, function(err, mongoCmd) {
      var args, mongoimport;
      if (err != null) {
        return logger.error("error occured during mongoimport");
      } else {
        args = ['--db', 'popular_convention2', '--collection', datetime, '--file', archiveDir + "/" + datetime + ".json", '--type', 'json','--jsonArray'];
        if (process.env['NODE_ENV'] === 'production') {
          args = args.concat(['--username', process.env["MONGODB_USER"], '--password', process.env["MONGODB_PASS"]]);
        }
        mongoimport = spawn(mongoCmd, args);
        mongoimport.stderr.on('data', function(data) {
          return logger.error(data);
        });
        return mongoimport.on('close', function(code) {
          var doc;
          logger.info("mongoimport exited with code " + code);
          doc = {
            file: datetime,
            inProcess: false,
            completed: false,
            summarize: false
          };
          if (code === 0) {
            persistence.insertWorklogs(doc, (function() {
              return callback();
            }));
          }
          if (code !== 0) {
            callback(code);
          }
          return deleteArchiveFile(datetime);
        });
      }
    });
  };

  deleteArchiveFile = function(datetime) {
    return fs.unlink(archiveDir + "/" + datetime + ".json", function(err) {
      if (err) {
        return logger.error("delete " + archiveDir + "/" + datetime + ".json");
      }
    });
  };

  mergeConvention = function(baseConvention, newConvention) {
    var conv, k, key, results;
    results = [];
    for (key in baseConvention) {
      conv = baseConvention[key];
      results.push((function() {
        if (key !== 'lang') {
          if (newConvention[key] != null) {
            for (k in conv) {
              if (k !== 'commits') {
                conv[k] += newConvention[key][k];
              }
            }
            if (conv.commits.concat != null) {
              return conv.commits = _.uniq(conv.commits.concat(newConvention[key].commits));
            } else {
              return conv.commits = conv.commits + newConvention[key].commits;
            }
          }
        }
      })());
    }
    return results;
  };

  makeResult = function(lang, dailyData, callback) {
    var key, sumData, total;
    sumData = {
      lang: lang,
      period: [],
      raw: dailyData
    };
    dailyData.forEach(function(data) {
      var i, key, len, ref;
      if (sumData.scores == null) {
        sumData.scores = data.convention;
        return sumData.period.push(data.file);
      } else {
        for (key in sumData.scores) {
          if (key !== 'lang') {
            if ((data.convention[key] != null)) {
              sumData.scores[key].column.forEach(function(elem) {
                return sumData.scores[key][elem.key] += data.convention[key][elem.key];
              });
              sumData.scores[key].commits += data.convention[key].commits;
            }
          }
        }
        ref = Object.keys(data.convention).filter(function(x) {
          return !~Object.keys(sumData.scores).indexOf(x);
        });
        for (i = 0, len = ref.length; i < len; i++) {
          key = ref[i];
          sumData.scores[key] = data.convention[key];
        }
        return sumData.period.push(data.file);
      }
    });
    for (key in sumData.scores) {
      if (key !== 'lang') {
        total = 0;
        sumData.scores[key].column.forEach(function(elem) {
          total += sumData.scores[key][elem.key];
          return elem.code = hljs.highlight(getHighlightName(lang), elem.code).value;
        });
        sumData.scores[key].total = total;
      }
    }
    return callback(null, sumData);
  };

}).call(this);
