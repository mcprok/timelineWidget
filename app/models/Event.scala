package models

import org.joda.time.DateTime


/**
 * Created with IntelliJ IDEA.
 * User: maciejprokopiuk
 * Date: 22/05/14
 * Time: 19:30
 * To change this template use File | Settings | File Templates.
 */
case class Event(
  uid : String,
  startTime : Long,
  summary : String,
  location : String,
  endTime : Option[Long],
  description : Option[String],
  geo : Option[(Double, Double)]
)
